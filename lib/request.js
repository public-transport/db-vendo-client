import {stringify} from 'qs';
import tls from 'tls';
import https from 'https';
import {Request, fetch} from 'cross-fetch';
import {parse as parseContentType} from 'content-type';
import {HafasError} from './errors.js';

const proxyAddress = typeof process !== 'undefined' && (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) || null;

// cross-fetch uses node-fetch@2, which only speaks HTTP/1.1. Hosts like
// app.services-bahn.de (Akamai) negotiate HTTP/2 over TLS whenever the client
// offers `h2` via ALPN, after which node-fetch tries to parse the HTTP/2 binary
// frames with its HTTP/1.1 parser and throws
// `HPE_INVALID_CONSTANT` ("Expected HTTP/..."). Pin ALPN to http/1.1 so
// the connection can never negotiate a protocol we cannot read, regardless of
// how https.globalAgent is configured.
// See https://github.com/public-transport/db-vendo-client/issues/53
let defaultAgent;
const getDefaultAgent = () => {
	if (!defaultAgent) {
		defaultAgent = new https.Agent({ALPNProtocols: ['http/1.1']});
	}
	return defaultAgent;
};

let proxyConfigured = false;
let getAgent = () => getDefaultAgent();

const ciphers = [
	'TLS_AES_128_GCM_SHA256',
	'TLS_AES_256_GCM_SHA384',
	'TLS_CHACHA20_POLY1305_SHA256',
	'ECDHE-ECDSA-AES128-GCM-SHA256',
	'ECDHE-RSA-AES128-GCM-SHA256',
	'ECDHE-ECDSA-AES256-GCM-SHA384',
	'ECDHE-RSA-AES256-GCM-SHA384',
	'ECDHE-ECDSA-CHACHA20-POLY1305',
	'ECDHE-RSA-CHACHA20-POLY1305',
	'ECDHE-RSA-AES128-SHA',
	'ECDHE-RSA-AES256-SHA',
	'AES128-GCM-SHA256',
	'AES256-GCM-SHA384',
	'AES128-SHA',
	'AES256-SHA',
].join(':');

if (process.env.DB_PROFILE == 'db') {
	tls.DEFAULT_CIPHERS = ciphers;
}

const setupProxy = async () => {
	if (proxyAddress && !proxyConfigured) {
		const a = await import('https-proxy-agent');
		const agent = new a.default.HttpsProxyAgent(proxyAddress, {
			keepAlive: true,
			keepAliveMsecs: 10 * 1000, // 10s
			ALPNProtocols: ['http/1.1'],
		});
		getAgent = () => agent;
		proxyConfigured = true;
	}
};

const randomBytesHexString = length => [...Array(length)].map(() => Math.floor(Math.random() * 16)
	.toString(16))
	.join('');

const id = randomBytesHexString(6)
	.toString('hex');
const randomizeUserAgent = (userAgent) => {
	let ua = userAgent;
	for (
		let i = Math.round(5 + Math.random() * 5);
		i < ua.length;
		i += Math.round(5 + Math.random() * 5)
	) {
		ua = ua.slice(0, i) + id + ua.slice(i);
		i += id.length;
	}
	return ua;
};

const checkIfResponseIsOk = (_) => {
	const {
		body,
		errProps: baseErrProps,
	} = _;

	const errProps = {
		...baseErrProps,
	};
	if (body.id) {
		errProps.hafasResponseId = body.id;
	}

	// Because we want more accurate stack traces, we don't construct the error here,
	// but only return the constructor & error message.
	const getError = (_) => {
		// mutating here is ugly but pragmatic
		if (_.fehlerNachricht.ueberschrift) {
			errProps.hafasMessage = _.fehlerNachricht.ueberschrift;
		}
		if (_.fehlerNachricht.text) {
			errProps.hafasDescription = _.fehlerNachricht.text;
		}
		return {
			Error: HafasError,
			message: errProps.hafasMessage || 'unknown error',
			props: {code: _.fehlerNachricht.code},
		};
	};

	if (body.fehlerNachricht || body.errors) { // TODO better handling
		const {Error: HafasError, message, props} = getError(body);
		throw new HafasError(message, body.err || body.errors, {...errProps, ...props});
	}
};

const request = async (ctx, userAgent, reqData) => {
	const {profile, opt} = ctx;
	await setupProxy();

	const endpoint = reqData.endpoint;
	delete reqData.endpoint;
	const rawReqBody = profile.transformReqBody(ctx, reqData.body);

	const reqOptions = profile.transformReq(ctx, {
		agent: getAgent(),
		keepalive: true,
		method: reqData.method,
		// todo: CORS? referrer policy?
		body: JSON.stringify(rawReqBody),
		headers: {
			'Content-Type': 'application/json',
			// 'Accept-Encoding': 'gzip, deflate, br, zstd',
			'Accept': 'application/json',
			'Accept-Language': opt.language || profile.defaultLanguage || 'en',
			'user-agent': profile.randomizeUserAgent
				? randomizeUserAgent(userAgent)
				: userAgent,
			...reqData.headers,
		},
		redirect: 'follow',
		query: reqData.query,
	});

	let url = endpoint + (reqData.path || '');
	if (reqOptions.query) {
		url += '?' + stringify(reqOptions.query, {arrayFormat: 'brackets', encodeValuesOnly: true});
	}
	const reqId = randomBytesHexString(6);
	const fetchReq = new Request(url, reqOptions);
	profile.logRequest(ctx, fetchReq, reqId);

	const res = await fetch(url, reqOptions);

	const errProps = {
		// todo [breaking]: assign as non-enumerable property
		request: fetchReq,
		// todo [breaking]: assign as non-enumerable property
		response: res,
		url,
	};

	if (!res.ok) {
		// todo [breaking]: make this a FetchError or a HafasClientError?
		console.log(JSON.stringify(res), await res.text());
		const err = new Error(res.statusText);
		Object.assign(err, errProps);
		throw err;
	}

	let cType = res.headers.get('content-type');
	if (cType) {
		const {type} = parseContentType(cType);
		if (type !== reqOptions.headers['Accept']) {
			throw new HafasError('invalid/unsupported response content-type: ' + cType, null, errProps);
		}
	}

	const body = await res.text();
	profile.logResponse(ctx, res, body, reqId);

	const b = JSON.parse(body);
	checkIfResponseIsOk({
		body: b,
		errProps,
	});
	return {
		res: b,
		common: {},
	};
};

export {
	checkIfResponseIsOk,
	request,
};
