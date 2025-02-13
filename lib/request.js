import {stringify} from 'qs';
import {Request, fetch} from 'cross-fetch';
import {parse as parseContentType} from 'content-type';
import {HafasError} from './errors.js';

// const proxyAddress = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || null;
// const localAddresses = process.env.LOCAL_ADDRESS || null;

// if (proxyAddress && localAddresses) {
// 	console.error('Both env vars HTTPS_PROXY/HTTP_PROXY and LOCAL_ADDRESS are not supported.');
// 	process.exit(1);
// }

// const plainAgent = new HttpsAgent({
// 	keepAlive: true,
// });
// let getAgent = () => plainAgent;

// if (proxyAddress) {
// 	const agent = new ProxyAgent(proxyAddress, {
// 		keepAlive: true,
// 		keepAliveMsecs: 10 * 1000, // 10s
// 	});
// 	getAgent = () => agent;
// } else if (localAddresses) {
// 	const agents = process.env.LOCAL_ADDRESS.split(',')
// 		.map((addr) => {
// 			const family = isIP(addr);
// 			if (family === 0) {
// 				throw new Error('invalid local address:' + addr);
// 			}
// 			return new HttpsAgent({
// 				localAddress: addr, family,
// 				keepAlive: true,
// 			});
// 		});
// 	const pool = roundRobin(agents);
// 	getAgent = () => pool.get();
// }

// const id = randomBytes(3)
// 	.toString('hex');
// const randomizeUserAgent = (userAgent) => {
// 	let ua = userAgent;
// 	for (
// 		let i = Math.round(5 + Math.random() * 5);
// 		i < ua.length;
// 		i += Math.round(5 + Math.random() * 5)
// 	) {
// 		ua = ua.slice(0, i) + id + ua.slice(i);
// 		i += id.length;
// 	}
// 	return ua;
// };

const randomBytesHex = (nBytes = 8) => {
	const array = new Uint8Array(nBytes);
	crypto.getRandomValues(array);
	return Array.from(array)
	  .map((byte) => byte.toString(16).padStart(2, '0'))
	  .join('');
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

	if (body.fehlerNachricht) { // TODO better handling
		const {Error: HafasError, message, props} = getError(body);
		throw new HafasError(message, body.err, {...errProps, ...props});
	}
};

const request = async (ctx, userAgent, reqData) => {
	const {profile, opt} = ctx;

	const endpoint = reqData.endpoint;
	delete reqData.endpoint;
	const rawReqBody = profile.transformReqBody(ctx, reqData.body);

	const reqOptions = profile.transformReq(ctx, {
		keepalive: true,
		method: reqData.method,
		// todo: CORS? referrer policy?
		body: JSON.stringify(rawReqBody),
		headers: {
			'Content-Type': 'application/json',
			'Accept-Encoding': 'gzip, br, deflate',
			'Accept': 'application/json',
			'Accept-Language': opt.language || profile.defaultLanguage || 'en',
			'user-agent': userAgent,
			...reqData.headers,
		},
		redirect: 'follow',
		query: reqData.query,
	});

	let url = endpoint + (reqData.path || '');
	if (reqOptions.query) {
		url += '?' + stringify(reqOptions.query, {arrayFormat: 'brackets', encodeValuesOnly: true});
	}
	const reqId = randomBytesHex(3);
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
