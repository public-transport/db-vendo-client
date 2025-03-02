# `db-vendo-client` API

Also see the [root readme](https://github.com/public-transport/db-vendo-client) for a shortlist of differences of db-vendo-client to hafas-client and of differences between the profiles.

- [`journeys(from, to, [opt])`](journeys.md) – get journeys between locations
- [`refreshJourney(refreshToken, [opt])`](refresh-journey.md) – fetch up-to-date/more details of a `journey`
- `journeysFromTrip(tripId, previousStopover, to, [opt])` – not supported
- [`trip(id, lineName, [opt])`](trip.md) – get details for a trip
- `tripsByName(lineNameOrFahrtNr, [opt])` – not supported
- [`departures(station, [opt])`](departures.md) – query the next departures at a station
- [`arrivals(station, [opt])`](arrivals.md) – query the next arrivals at a station
- [`locations(query, [opt])`](locations.md) – find stations, POIs and addresses
- [`stop(id, [opt])`](stop.md) – get details about a stop/station
- [`nearby(location, [opt])`](nearby.md) – show stations & POIs around
- `radar(north, west, south, east, [opt])` – not supported
- `reachableFrom(address, [opt])` – not supported
- `remarks([opt])` – not supported
- `lines(query, [opt])` – not supported
- `serverInfo([opt])` – not supported
