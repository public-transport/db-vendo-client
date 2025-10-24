# db-vendo-client

**A client for the new "vendo"/"movas" Deutsche Bahn APIs, a drop-in replacement for [hafas-client](https://github.com/public-transport/hafas-client/).**

[![npm version](https://img.shields.io/npm/v/db-vendo-client.svg)](https://www.npmjs.com/package/db-vendo-client)
![ISC-licensed](https://img.shields.io/github/license/public-transport/db-vendo-client.svg)
[![support Jannis via GitHub Sponsors](https://img.shields.io/badge/support%20Jannis-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)

The following [FPTF](https://github.com/public-transport/friendly-public-transport-format)/[hafas-client](https://github.com/public-transport/hafas-client/) endpoints are supported (depending on the chosen profile, see below):

* `journeys()`, `refreshJourney()` including tickets and bestprice option
* `locations()`, `nearby()`,
* `departures()`, `arrivals()` boards
* `trip()`

What doesn't work:

* `journeys()` details like stop/station groups, some line details ...
* loadFactor and other details in boards
* certain stop details like products for `locations()` and geopositions for boards – this can be remedied with `enrichStations` in the config (turned on by default), enriching stop info with [db-hafas-stations](https://github.com/derhuerst/db-hafas-stations).
* some query options/filters (e.g. routingMode for journeys, direction for boards)
* all other endpoints (`tripsByName()`, `radar()`, `journeysFromTrip()`, `reachableFrom()`, `remarks()`, `lines()`, `station()`)

Depending on the configured profile, db-vendo-client will use multiple different DB APIs that offer varying functionality, so choose wisely:

| Profile               | `db`              | `dbnav` | `dbweb` | `dbris` |
| -------------         | -------------     | ------------- | ------------- | ------------- |
| no API key required   | ✅                | ✅ |  ✅ | ❌ |
| all above endpoints supported | ✅              | ✅ | except `stop()` | only boards |
| duration for boards   | always 1h         | always 1h | always 1h | up to 12h |
| remarks               | for boards only most important remarks    | for boards only most important remarks | all remarks on boards and journeys | all  remarks |
| cancelled trips       | contained with cancelled flag | contained with cancelled flag | contained with cancelled flag | contained with cancelled flag |
| tickets               | only for `refreshJourney()`, mutually exclusive with polylines | only for `refreshJourney()`, mutually exclusive with polylines | only for `refreshJourney()`, mutually exclusive with polylines | ❌ |
| polylines             | only for `refreshJourney()/trip()`, mutually exclusive with tickets | only for `refreshJourney()/trip()`, mutually exclusive with tickets | only for `refreshJourney()/trip()`, mutually exclusive with tickets | ❌ |
| trip ids used         | HAFAS trip ids | HAFAS trip ids | HAFAS trip ids | RIS trip ids | 
| line.id/fahrtNr used  | actual fahrtNr for journeys, unreliable/route id for boards and `trip()` | actual fahrtNr for journeys, unreliable/route id for boards and `trip()` | unreliable/route id | ✅ |
| adminCode/operator    | only for journeys | only for journeys | only operator | ✅ |
| stopovers             | not in boards | not in boards | ✅ | ✅ |
| assumed backend API stability | less stable | more stable | less stable | more stable |
| quotas | 60 requests per minute (IPv4), current backend possibly shut off soon | 60 requests per minute (IPv4), possibly aggressive blocking | aggressive blocking (IPv4/IPv6) | depends on API key |


> [!IMPORTANT]
> If you think that for your project, quotas may become an issue, [consider alternative ways to obtain the data you need.](https://github.com/derhuerst/db-rest/blob/6/docs/readme.md#why-not-to-use-this-api), e.g. [motis-fptf-client](https://github.com/motis-project/motis-fptf-client) (a drop-in replacement for db-vendo-client/hafas-client) in conjunction with https://transitous.org (please consider the [usage policy](https://transitous.org/api/) there) or a self-hosted [MOTIS](https://github.com/motis-project/motis) instance.

Feel free to report anything that you stumble upon via Issues or create a PR :)

Also consult the **[documentation](docs/readme.md)**.

## Background

After DB has switched to the new "vendo"/"movas" platform for bahn.de and DB Navigator, the old [HAFAS](https://de.wikipedia.org/wiki/HAFAS) API (see [hafas-client](https://github.com/public-transport/hafas-client/)) seems now to have been shut off. This project aims to enable easy switching to the new APIs. However, not all information will be available from the new APIs.

Actually, db-vendo-client is a wrapper around multiple different APIs, currently the bahn.de API for `dbweb`, the DB Navigator API for the `dbnav` profile, and a combination of the DB Navigator API and the regio-guide RIS API for the `db` profile. See some [notes about the various new APIs at DB](docs/db-apis.md).

Strictly speaking, permission is necessary to use this library with the DB APIs.

## Usage

Use it as a dependency, e.g. just replacing [hafas-client](https://github.com/public-transport/hafas-client/):

```
npm i db-vendo-client
```

See an example in [api.js](api.js). It shows how you can use `db-vendo-client` together with [hafas-rest-api](https://github.com/public-transport/hafas-rest-api/) in order to run a [FPTF](https://github.com/public-transport/friendly-public-transport-format) API server. The [Dockerfile](Dockerfile) serves this API (using the `dbnav` profile):

```
docker run \
    -e USER_AGENT=my-awesome-program \
    -e DB_PROFILE=dbnav \
    -p 3000:3000 \
    ghcr.io/public-transport/db-vendo-client
```

You may want to generate a client for your programming language for this REST API using the [OpenAPI schema](docs/openapi.yaml) ([open in Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/public-transport/db-vendo-client/refs/heads/main/docs/openapi.yaml)). Note 
that this is to be seen more as a starting point for implementation, e.g. some profile-specific details like tickets are missing from this API definition.

There are [community-maintained TypeScript typings available as `@types/hafas-client`](https://www.npmjs.com/package/@types/hafas-client). 

> [!IMPORTANT]
> Depending on your use case, it is very important that you employ caching, either with a simple [HTTP proxy cache](https://github.com/traines-source/time-space-train-planner/blob/master/deployments/nginx-cache.conf) in front of the REST API or by using [cached-hafas-client](https://github.com/public-transport/cached-hafas-client) (where, of course, you can just drop in a `db-vendo-client` instead of a `hafas-client` instance). Also see [db-rest](https://github.com/derhuerst/db-rest), which does this and some more plumbing.

## Browser usage

`db-vendo-client` is mostly browser compatible, however none of the endpoints enables CORS, so it is impossible to use `db-vendo-client` in normal browser environments. It was tested with vite + capacitorjs and should also work with cordova or react native and similar projects.

**Limitations:** Does not work with `enrichStations` option enabled or with the `dbris` profile.

## Related Projects

- [hafas-client](https://github.com/public-transport/hafas-client/) – including further related projects
- [hafas-rest-api](https://github.com/public-transport/hafas-rest-api/) – expose a hafas-client or db-vendo-client instance as a REST API
- [db-rest](https://github.com/derhuerst/db-rest/) – for the legacy DB HAFAS endpoint
- [motis-fptf-client](https://github.com/motis-project/motis-fptf-client) – a drop-in replacement for db-vendo-client/hafas-client wrapping a [MOTIS](https://github.com/motis-project/motis) instance
- [`*.transport.rest`](https://transport.rest/) – Public APIs wrapping some HAFAS endpoints.

## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, please [open an Issue](https://github.com/public-transport/db-vendo-client/issues).

This project needs help! Check the [list of "help wanted" Issues](https://github.com/public-transport/db-vendo-client/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

If you're contributing code, please read the [contribution guidelines](contributing.md).
