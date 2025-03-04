# `db-vendo-client` documentation

**[JS API documentation](api.md)**

[REST API OpenAPI schema](openapi.yaml) ([open in Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/public-transport/db-vendo-client/refs/heads/main/docs/openapi.yaml))

## Migrating from an old (v5) `hafas-client` version

`db-vendo-client` tries to be as compatible as possible with `hafas-client` v6. If you were still on v5 or earlier, see the [`5` → `6` migration guide](https://github.com/public-transport/hafas-client/blob/main/docs/migrating-to-6.md) of `hafas-client`.

## Throttling requests

There's opt-in support for throttling requests to the endpoint.

```js
import {createClient} from 'db-vendo-client'
import {withThrottling} from 'db-vendo-client/throttle.js'
import {profile as dbProfile} from 'db-vendo-client/p/db/index.js'

const userAgent = 'link-to-your-project-or-email' // adapt this to your project!

// create a throttled HAFAS client with Deutsche Bahn profile
const client = createClient(withThrottling(dbProfile), userAgent)

// Berlin Jungfernheide to München Hbf
await client.journeys('8011167', '8000261', {results: 1})
```

You can also pass custom values for the nr of requests (`limit`) per interval into `withThrottling`:

```js
// 2 requests per second
const throttledDbProfile = withThrottling(dbProfile, 2, 1000)
const client = createClient(throttledDbProfile, userAgent)
```

## Retrying failed requests

There's opt-in support for retrying failed requests to the endpoint.

```js
import {createClient} from 'db-vendo-client'
import {withRetrying} from 'db-vendo-client/retry.js'
import {profile as dbProfile} from 'db-vendo-client/p/db/index.js'

const userAgent = 'link-to-your-project-or-email' // adapt this to your project!

// create a client with Deutsche Bahn profile that will retry on HAFAS errors
const client = createClient(withRetrying(dbProfile), userAgent)
```

You can pass custom options into `withRetrying`. They will be passed into [`retry`](https://github.com/tim-kos/node-retry#tutorial).

```js
// retry 2 times, after 10 seconds & 30 seconds
const retryingDbProfile = withRetrying(dbProfile, {
	retries: 2,
	minTimeout: 10 * 1000,
	factor: 3
})
const client = createClient(retryingDbProfile, userAgent)
```

## User agent randomization

By default, `db-vendo-client` does not randomize the client name that you pass into `createClient`, and sends it as [`User-Agent`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) as it is. At least DB Navigator always sends the same user agent as well (cf. `dbnav` profile).  You can turn on randomization by setting `profile.randomizeUserAgent` to `false`:

```js
const client = createClient({
	...someProfile,
	randomizeUserAgent: true,
}, userAgent)
```

## Logging requests

You can use `profile.logRequest` and `profile.logResponse` to process the raw [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response), respectively.

As an example, we can implement a custom logger:

```js
import {createClient} from 'db-vendo-client'
import {profile as dbProfile} from 'db-vendo-client/p/db/index.js'

const userAgent = 'link-to-your-project-or-email' // adapt this to your project!

const logRequest = (ctx, fetchRequest, requestId) => {
	// ctx looks just like with the other profile.* hooks:
	const {dbProfile, opt} = ctx

	console.debug(requestId, fetchRequest.headers, fetchRequest.body + '')
}

const logResponse = (ctx, fetchResponse, body, requestId) => {
	console.debug(requestId, fetchResponse.headers, body + '')
}

// create a client with Deutsche Bahn profile that debug-logs
const client = createClient({
	...dbProfile,
	logRequest,
	logResponse,
}, userAgent)
```

```js
// logRequest output:
'29d0e3' {
	accept: 'application/json',
	'accept-encoding': 'gzip, br, deflate',
	'content-type': 'application/json',
	connection: 'keep-alive',
	'user-agent': 'hafas842c51-clie842c51nt debug C842c51LI'
} {"lang":"de","svcReqL":[{"cfg":{"polyEnc":"GPA"},"meth":"LocMatch",…
// logResponse output:
'29d0e3' {
	'content-encoding': 'gzip',
	'content-length': '1010',
	'content-type': 'application/json; charset=utf-8',
	date: 'Thu, 06 Oct 2022 12:31:09 GMT',
	server: 'Apache',
	vary: 'User-Agent'
} {"ver":"1.45","lang":"deu","id":"sb42zgck4mxtxm4s","err":"OK","graph"…
```

The default `profile.logRequest` [`console.error`](https://nodejs.org/docs/latest-v10.x/api/console.html#console_console_error_data_args)s the request body, if you have set `$DEBUG` to `hafas-client`. Likewise, `profile.logResponse` `console.error`s the response body.

## Error handling

Unexpected errors – e.g. due to bugs in `db-vendo-client` itself – aside, its methods may reject with the following errors:

- `Error` – A generic error, e.g. if the DB backend returned a HTTP error.
- `HafasError` – A generic error to signal that something HAFAS-related went wrong, either in the client, or in the HAFAS endpoint.

Each `HafasError` error has the following properties:

- `isHafasError` – Always `true`. Allows you to distinguish HAFAS-related errors from e.g. network errors.
- `code` – A string representing the error type for all other error classes, e.g. `INVALID_REQUEST` for `HafasInvalidRequestError`. `null` for plain `HafasError`s.
- `isCausedByServer` – Boolean, telling you if the HAFAS endpoint says that it couldn't process your request because *it* is unavailable/broken.
- `hafasCode` – A HAFAS-specific error code, if the HAFAS endpoint returned one; e.g. `H890` when no journeys could be found. `null` otherwise.
- `request` – The [Fetch API `Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) of the request.
- `url` – The URL of the request.
- `response` – The [Fetch API `Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).


## Using `db-vendo-client` from another language

If you want to use `db-vendo-client` to access DB APIs but work with non-Node.js environments, you can use it together with [hafas-rest-api](https://github.com/public-transport/hafas-rest-api) to create a REST API (see the [root readme](https://github.com/public-transport/db-vendo-client/tree/main#usage) and the Docker image). 
Or use [`hafas-client-rpc`](https://github.com/derhuerst/hafas-client-rpc) to create a [JSON-RPC](https://www.jsonrpc.org) interface that you can send commands to.


## General documentation and notes for DB APIs

[`db-apis.md`](db-apis.md)
