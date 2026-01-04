# `journeys(from, to, [opt])`

`from` and `to` each must be in one of these formats:

```js
// a station ID, in a format compatible to the profile you use
'900000013102'

// an FPTF `station` object
{
	type: 'station',
	id: '900000013102',
	name: 'foo station',
	location: {
		type: 'location',
		latitude: 1.23,
		longitude: 3.21
	}
}

// a point of interest, which is an FPTF `location` object
{
	type: 'location',
	id: '123',
	poi: true,
	name: 'foo restaurant',
	latitude: 1.23,
	longitude: 3.21
}

// an address, which is an FPTF `location` object
{
	type: 'location',
	address: 'foo street 1',
	latitude: 1.23,
	longitude: 3.21
}
```

With `opt`, you can override the default options, which look like this:

```js
{
	// Use either `departure` or `arrival` to specify a date/time.
	departure: new Date(),
	arrival: null,

	earlierThan: null, // ref to get journeys earlier than the last query
	laterThan: null, // ref to get journeys later than the last query

	results: null, // number of journeys – `null` means "whatever HAFAS returns"
	via: null, // let journeys pass this station
	stopovers: false, // return stations on the way?
	transfers: -1, // Maximum nr of transfers. Default: Let HAFAS decide.
	transferTime: 0, // minimum time for a single transfer in minutes
	accessibility: 'none', // not supported
	bike: false, // only bike-friendly journeys
	walkingSpeed: 'normal', // not supported
	// Consider walking to nearby stations at the beginning of a journey?
	startWithWalking: true, // always true (?)
	products: {
		// these entries may vary from profile to profile
		suburban: true,
		subway: true,
		tram: true,
		bus: true,
		ferry: true,
		nationalExpress: true,
		national: true,
		regional: true
		regionalExpress: true // this is actually FlixTrain and co.
	},
	tickets: false, // return tickets? only available for [refreshJourney](refresh-journey.md)
	polylines: false, // return a shape for each leg? only available for [refreshJourney](refresh-journey.md)
	subStops: true, // not supported
	entrances: true, // not supported
	remarks: true, // parse & expose hints & warnings?
	scheduledDays: false, // returns a field `serviceDays` (instead of `scheduledDays` in hafas-client!) with a different, human-readable structure
	notOnlyFastRoutes: false, // if true, also show journeys that are mathematically non-optimal
	bestprice: false, // search for lowest prices across the entire day, returns list of journeys sorted by price
	firstClass: false, // first or second class for tickets
	loyaltyCard: null, // BahnCards etc., see below
	language: 'en', // language to get results in
	bmisNumber: null, // 7-digit BMIS number for business customer rates
	autoFetchVerbundtickets: false, // automatically fetch Verbundticket prices via recon API (see below)
}
```

## Response

*Note:* As stated in the [*Friendly Public Transport Format* v2 draft spec](https://github.com/public-transport/friendly-public-transport-format/blob/3bd36faa721e85d9f5ca58fb0f38cdbedb87bbca/spec/readme.md), the returned `departure` and `arrival` times include the current delay. The `departureDelay`/`arrivalDelay` fields express how much they differ from the schedule.


```js
import {createClient} 'db-vendo-client'
import {profile as dbProfile} from 'db-vendo-client/p/db/index.js'

const userAgent = 'link-to-your-project-or-email' // adapt this to your project!
const client = createClient(dbProfile, userAgent)

// Frankfurt to Stuttgart
await client.journeys('8000105', '8000096', {
	results: 1,
	stopovers: true
})
```

`journeys()` will resolve with an object with the following fields:
- `journeys`
- `earlierRef`/`laterRef` – pass them as `opt.earlierThan`/`opt.laterThan` into another `journeys()` call to retrieve the next "page" of journeys
- `realtimeDataUpdatedAt` – is currently not set in db-vendo-client, because the upstream APIs don't provide it.

This object might look like this:

```js
{
	journeys: [ {
		legs: [ {
			tripId: '1|32615|6|86|10072018',
			direction: 'S Ahrensfelde',
			line: {
				type: 'line',
				id: '16845',
				fahrtNr: '12345',
				name: 'S7',
				public: true,
				mode: 'train',
				product: 'suburban',
				operator: {
					type: 'operator',
					id: 's-bahn-berlin-gmbh',
					name: 'S-Bahn Berlin GmbH'
				},
				symbol: 'S',
				nr: 7,
				metro: false,
				express: false,
				night: false
			},
			currentLocation: {
				type: 'location',
				latitude: 52.51384,
				longitude: 13.526806,
			},

			origin: {
				type: 'station',
				id: '900000003201',
				name: 'S+U Berlin Hauptbahnhof',
				location: {
					type: 'location',
					latitude: 52.52585,
					longitude: 13.368928
				},
				products: {
					suburban: true,
					subway: true,
					tram: true,
					bus: true,
					ferry: false,
					express: true,
					regional: true
				}
			},
			departure: '2018-07-10T23:54:00+02:00',
			plannedDeparture: '2018-07-10T23:53:00+02:00',
			departureDelay: 60,
			departurePlatform: '15',
			plannedDeparturePlatform: '14',

			destination: {
				type: 'station',
				id: '900000100004',
				name: 'S+U Jannowitzbrücke',
				location: {
					type: 'location',
					latitude: 52.504806,
					longitude: 13.303846
				},
				products: { /* … */ }
			},
			arrival: '2018-07-11T00:02:00+02:00',
			plannedArrival: '2018-07-11T00:01:00+02:00',
			arrivalDelay: 60,
			arrivalPlatform: '3',
			plannedArrivalPlatform: '3',

			stopovers: [ {
				stop: {
					type: 'station',
					id: '900000003201',
					name: 'S+U Berlin Hauptbahnhof',
					/* … */
				},

				arrival: null,
				plannedArrival: null,
				arrivalPlatform: null,
				plannedArrivalPlatform: null,
				departure: null,
				plannedDeparture: null,
				departurePlatform: null,
				plannedDeparturePlatform: null,

				remarks: [
					{type: 'hint', code: 'bf', text: 'barrier-free'},
					{type: 'hint', code: 'FB', text: 'Bicycle conveyance'}
				]
			}, {
				stop: {
					type: 'station',
					id: '900000100001',
					name: 'S+U Friedrichstr.',
					/* … */
				},

				cancelled: true,
				arrival: null,
				plannedArrival: '2018-07-10T23:55:00+02:00',
				prognosedArrival: '2018-07-10T23:56:00+02:00',
				arrivalDelay: 60,
				arrivalPlatform: null,
				plannedArrivalPlatform: null,

				departure: null,
				plannedDeparture: '2018-07-10T23:56:00+02:00',
				prognosedDeparture: '2018-07-10T23:57:00+02:00',
				departureDelay: 60,
				departurePlatform: null,
				plannedDeparturePlatform: null,

				remarks: [ /* … */ ]
			},
			/* … */
			{
				stop: {
					type: 'station',
					id: '900000100004',
					name: 'S+U Jannowitzbrücke',
					/* … */
				},

				arrival: '2018-07-11T00:02:00+02:00',
				plannedArrival: '2018-07-11T00:01:00+02:00',
				arrivalDelay: 60,
				arrivalPlatform: null,
				plannedArrivalPlatform: null,

				departure: '2018-07-11T00:02:00+02:00',
				plannedDeparture: '2018-07-11T00:02:00+02:00',
				departureDelay: null,
				departurePlatform: null,
				plannedDeparturePlatform: null,

				remarks: [ /* … */ ]
			} ]
		}, {
			public: true,
			walking: true,
			distance: 558,

			origin: {
				type: 'station',
				id: '900000100004',
				name: 'S+U Jannowitzbrücke',
				location: { /* … */ },
				products: { /* … */ }
			},
			departure: '2018-07-11T00:01:00+02:00',

			destination: {
				type: 'station',
				id: '900000100008',
				name: 'U Heinrich-Heine-Str.',
				location: { /* … */ },
				products: { /* … */ }
			},
			arrival: '2018-07-11T00:10:00+02:00'
		} ]
	} ],
	earlierRef: '…', // use with the `earlierThan` option
	laterRef: '…' // use with the `laterThan` option
	realtimeDataUpdatedAt: 1531259400, // 2018-07-10T23:50:00+02
}
```
If a journey leg has been cancelled, a `cancelled: true` will be added. Also, `departure`/`departureDelay`/`departurePlatform` and `arrival`/`arrivalDelay`/`arrivalPlatform` will be `null`.

To get more journeys earlier/later than the current set of results, pass `earlierRef`/`laterRef` into `opt.earlierThan`/`opt.laterThan`. For example, query *later* journeys as follows:

```js
const hbf = '900000003201'
const heinrichHeineStr = '900000100008'

const res1 = await client.journeys(hbf, heinrichHeineStr)
const lastJourney = res1.journeys[res1.journeys.length - 1]
console.log('departure of last journey', lastJourney.legs[0].departure)

// get later journeys
const res2 = await client.journeys(hbf, heinrichHeineStr, {
	laterThan: res1.laterRef
})
const firstLaterJourney = res2.journeys[res2.journeys.length - 1]
console.log('departure of first (later) journey', firstLaterJourney.legs[0].departure)
```

```
departure of last journey 2017-12-17T19:07:00+01:00
departure of first (later) journey 2017-12-17T19:19:00+01:00
```

## Using the `loyaltyCard` option

```js
import {data as loyaltyCards} from 'db-vendo-client/format/loyalty-cards.js' // see there for a list

hafas.journeys(from, to, {
	loyaltyCard: {type: data.BAHNCARD, discount: 25}
})
```

## Using the `bmisNumber` option

bahn.business customers with a BMIS number can get their corporate rates and corporate tariffs by providing their 7-digit BMIS number:

```js
// Option 1: Using the bmisNumber parameter directly
await client.journeys(from, to, {
	bmisNumber: '1234567' // Your 7-digit BMIS number
})

// Option 2: Using the createBusinessClient helper function
import {createBusinessClient} from 'db-vendo-client'
import {profile as dbProfile} from 'db-vendo-client/p/db/index.js'

const businessClient = createBusinessClient(dbProfile, userAgent, '1234567')
// Now all journey searches will automatically include the BMIS number
await businessClient.journeys(from, to)
```

When a BMIS number is provided, the request will include a `firmenZugehoerigkeit` object with the BMIS number and identification type, allowing business customers to access their special rates and conditions.

## The `routingMode` option

The `routingMode` option is not supported by db-vendo-client. The behavior will be the same as the [`HYBRID` mode of hafas-client](https://github.com/public-transport/hafas-client/blob/main/p/db/readme.md#using-the-routingmode-option), i.e. cancelled trains/infeasible journeys will also be contained for informational purpose.

## Verbundtickets

Verbundtickets (local transport network tickets) require a two-step API process to fetch prices. By default, journeys with Verbundtickets will not include ticket prices. To automatically fetch these prices, use the `autoFetchVerbundtickets` option:

```js
const journeys = await client.journeys(from, to, {
	tickets: true,
	autoFetchVerbundtickets: true // enable automatic Verbundticket price fetching
})
```

**Note:** This option will make an additional API request for each journey that contains Verbundtickets, which may impact performance. Use it only when you need ticket prices for local transport networks.

### Manual Verbundticket price fetching

If you prefer to fetch Verbundticket prices manually (or if automatic detection doesn't work), you can use the `refreshJourney` method:

```js
const journeys = await client.journeys(from, to, { tickets: true })
const journey = journeys.journeys[0]

// Check if journey has empty ticket prices but a refresh token
if (!journey.price && journey.refreshToken) {
	const refreshed = await client.refreshJourney(journey.refreshToken, { tickets: true })
	// refreshed.journey will have the Verbundticket prices
}
```