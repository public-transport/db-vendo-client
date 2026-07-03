# `refreshJourney(refreshToken, [opt])`

`refreshToken` must be a string, taken from `journey.refreshToken`.

With `opt`, you can override the default options, which look like this:

```js
{
	stopovers: false, // return stations on the way?
	polylines: false, // return a shape for each leg? mutually exclusive with tickets
	tickets: false, // return tickets? mutually exclusive with polylines
	subStops: true, // not supported
	entrances: true, // not supported
	remarks: true, // parse & expose hints & warnings?
	language: 'en' // language to get results in
}
```

## Response

```js
import {createClient} from 'db-vendo-client'
import {profile as dbProfile} from 'db-vendo-client/p/db/index.js'

const userAgent = 'link-to-your-project-or-email' // adapt this to your project!
const client = createClient(dbProfile, userAgent)

const {journeys} = await client.journeys('8000105', '8000096', {results: 1})

// later, fetch up-to-date info on the journey
const {
	journey,
	realtimeDataUpdatedAt,
} = await client.refreshJourney(journeys[0].refreshToken, {stopovers: true, remarks: true})
```

`journey` is a *single* [*Friendly Public Transport Format* v2 draft](https://github.com/public-transport/friendly-public-transport-format/blob/3bd36faa721e85d9f5ca58fb0f38cdbedb87bbca/spec/readme.md) `journey`, in the same format as returned by [`journeys()`](journeys.md).

`realtimeDataUpdatedAt` is currently not set in db-vendo-client, because the upstream APIs don't provide it.

## Verbund tickets

With the `db` or `dbnav` profile, pass `tickets: true` to retrieve fares offered by a local transport association (*Verbund*):

```js
const {journey} = await client.refreshJourney(refreshToken, {tickets: true})
console.log(journey.tickets)
```

This uses DB Navigator's ticket refresh endpoint. `journeys()` does not fetch these fares automatically, because doing so would require an additional backend request for every journey.
