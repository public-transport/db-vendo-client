import distance from 'gps-distance';

import {defaultProfile} from './lib/default-profile.js';
import {validateProfile} from './lib/validate-profile.js';

const isObj = element => element !== null && 'object' === typeof element && !Array.isArray(element);

// background info: https://github.com/public-transport/hafas-client/issues/286
const FORBIDDEN_USER_AGENTS = [
	'my-awesome-program', // previously used in readme.md, p/*/readme.md & docs/*.md
	'hafas-client-example', // previously used in p/*/example.js
	'link-to-your-project-or-email', // now used throughout
	'db-vendo-client',
];

const isNonEmptyString = str => 'string' === typeof str && str.length > 0;

const validateLocation = (loc, name = 'location') => {
	if (!isObj(loc)) {
		throw new TypeError(name + ' must be an object.');
	} else if (loc.type !== 'location') {
		throw new TypeError('invalid location object.');
	} else if ('number' !== typeof loc.latitude) {
		throw new TypeError(name + '.latitude must be a number.');
	} else if ('number' !== typeof loc.longitude) {
		throw new TypeError(name + '.longitude must be a number.');
	}
};

const loadEnrichedStationData = async (profile) => {
	const dbHafasStations = await import('db-hafas-stations');
	const items = {};
	for await (const station of dbHafasStations.readFullStations()) {
		items[station.id] = station;
		items[station.name] = station;
	}
	if (profile.DEBUG) {
		console.log('Loaded station index.');
	}
	return items;
};

const applyEnrichedStationData = async (ctx, shouldLoadEnrichedStationData) => {
	const {profile, common} = ctx;
	if (shouldLoadEnrichedStationData && !common.locations) {
		const locations = await loadEnrichedStationData(profile);
		common.locations = locations;
	}
};

const createClient = (profile, userAgent, opt = {}) => {
	profile = Object.assign({}, defaultProfile, profile);
	validateProfile(profile);
	const common = {};
	let shouldLoadEnrichedStationData = false;
	if (typeof opt.enrichStations === 'function') {
		profile.enrichStation = opt.enrichStations;
	} else if (opt.enrichStations !== false) {
		shouldLoadEnrichedStationData = true;
	}

	if ('string' !== typeof userAgent) {
		throw new TypeError('userAgent must be a string');
	}
	if (FORBIDDEN_USER_AGENTS.includes(userAgent.toLowerCase())) {
		throw new TypeError(`userAgent should tell the API operators how to contact you. If you have copied "${userAgent}" value from the documentation, please adapt it.`);
	}

	const _stationBoard = async (station, type, resultsField, parse, opt = {}) => {
		await applyEnrichedStationData({profile, common}, shouldLoadEnrichedStationData);
		if (isObj(station) && station.id) {
			station = station.id;
		} else if ('string' !== typeof station) {
			throw new TypeError('station must be an object or a string.');
		}

		if ('string' !== typeof type || !type) {
			throw new TypeError('type must be a non-empty string.');
		}

		if (!profile.departuresGetPasslist && opt.stopovers) {
			throw new Error('opt.stopovers is not supported by this endpoint');
		}
		if (!profile.departuresStbFltrEquiv && 'includeRelatedStations' in opt) {
			throw new Error('opt.includeRelatedStations is not supported by this endpoint');
		}

		opt = Object.assign({
			// todo: for arrivals(), this is actually a station it *has already* stopped by
			direction: null, // only show departures stopping by this station
			line: null, // filter by line ID
			duration: 10, // show departures for the next n minutes
			results: null, // max. number of results; `null` means "whatever HAFAS wants"
			subStops: true, // parse & expose sub-stops of stations?
			entrances: true, // parse & expose entrances of stops/stations?
			linesOfStops: false, // parse & expose lines at the stop/station?
			remarks: true, // parse & expose hints & warnings?
			stopovers: false, // fetch & parse previous/next stopovers?
			// departures at related stations
			// e.g. those that belong together on the metro map.
			includeRelatedStations: true,
			moreStops: null, // also include departures/arrivals for array of up to nine additional station evaNumbers  (not supported with dbnav and dbweb)
		}, opt);
		opt.when = new Date(opt.when || Date.now());
		if (Number.isNaN(Number(opt.when))) {
			throw new Error('opt.when is invalid');
		}

		const req = profile.formatStationBoardReq({profile, opt}, station, resultsField);

		const {res} = await profile.request({profile, opt}, userAgent, req);

		const ctx = {profile, opt, common, res};
		let results = (res[resultsField] || res.items || res.bahnhofstafelAbfahrtPositionen || res.bahnhofstafelAnkunftPositionen || res.entries.flat())
			.map(res => parse(ctx, res)); // TODO sort?, slice

		if (!opt.includeRelatedStations) {
			results = results.filter(r => !r.stop?.id || r.stop.id == station);
		}
		if (opt.direction) {
			results = results.filter(r => !r.nextStopovers || r.nextStopovers.find(s => s.stop?.id == opt.direction || s.stop?.name == opt.direction));
		}
		return {
			[resultsField]: results,
			realtimeDataUpdatedAt: null, // TODO
		};
	};

	const departures = async (station, opt = {}) => {
		return await _stationBoard(station, 'DEP', 'departures', profile.parseDeparture, opt);
	};
	const arrivals = async (station, opt = {}) => {
		return await _stationBoard(station, 'ARR', 'arrivals', profile.parseArrival, opt);
	};

	const journeys = async (from, to, opt = {}) => {
		await applyEnrichedStationData({profile, common}, shouldLoadEnrichedStationData);
		if ('earlierThan' in opt && 'laterThan' in opt) {
			throw new TypeError('opt.earlierThan and opt.laterThan are mutually exclusive.');
		}
		if ('departure' in opt && 'arrival' in opt) {
			throw new TypeError('opt.departure and opt.arrival are mutually exclusive.');
		}
		let journeysRef = null;
		if ('earlierThan' in opt) {
			if (!isNonEmptyString(opt.earlierThan)) {
				throw new TypeError('opt.earlierThan must be a non-empty string.');
			}
			if ('departure' in opt || 'arrival' in opt) {
				throw new TypeError('opt.earlierThan and opt.departure/opt.arrival are mutually exclusive.');
			}
			journeysRef = opt.earlierThan;
		}
		if ('laterThan' in opt) {
			if (!isNonEmptyString(opt.laterThan)) {
				throw new TypeError('opt.laterThan must be a non-empty string.');
			}
			if ('departure' in opt || 'arrival' in opt) {
				throw new TypeError('opt.laterThan and opt.departure/opt.arrival are mutually exclusive.');
			}
			journeysRef = opt.laterThan;
		}

		opt = Object.assign({
			results: null, // number of journeys – `null` means "whatever HAFAS returns"
			via: null, // let journeys pass this station?
			stopovers: false, // return stations on the way?
			transfers: null, // maximum nr of transfers
			transferTime: 0, // minimum time for a single transfer in minutes
			// todo: does this work with every endpoint?
			accessibility: 'none', // 'none', 'partial' or 'complete'
			bike: false, // only bike-friendly journeys
			walkingSpeed: 'normal', // 'slow', 'normal', 'fast'
			// Consider walking to nearby stations at the beginning of a journey?
			startWithWalking: true,
			tickets: false, // return tickets?
			polylines: false, // return leg shapes?
			subStops: true, // parse & expose sub-stops of stations?
			entrances: true, // parse & expose entrances of stops/stations?
			remarks: true, // parse & expose hints & warnings?
			scheduledDays: false, // parse & expose dates each journey is valid on?
			notOnlyFastRoutes: false, // if true, also show routes that are mathematically non-optimal
			bestprice: false, // search for lowest prices across the entire day
			deutschlandTicketDiscount: false,
			deutschlandTicketConnectionsOnly: false,
			bmisNumber: null, // 7-digit BMIS number for business customer rates
		}, opt);

		if (opt.when !== undefined) {
			throw new Error('opt.when is not supported anymore. Use opt.departure/opt.arrival.');
		}
		let when = new Date(), outFrwd = true;
		if (opt.departure !== undefined && opt.departure !== null) {
			when = new Date(opt.departure);
			if (Number.isNaN(Number(when))) {
				throw new TypeError('opt.departure is invalid');
			}
		} else if (opt.arrival !== undefined && opt.arrival !== null) {
			if (!profile.journeysOutFrwd) {
				throw new Error('opt.arrival is unsupported');
			}
			when = new Date(opt.arrival);
			if (Number.isNaN(Number(when))) {
				throw new TypeError('opt.arrival is invalid');
			}
			outFrwd = false;
		}

		const req = profile.formatJourneysReq({profile, opt}, from, to, when, outFrwd, journeysRef);
		const {res} = await profile.request({profile, opt}, userAgent, req);
		const ctx = {profile, opt, common, res};
		if (opt.bestprice) {
			res.verbindungen = (res.intervalle || res.tagesbestPreisIntervalle).flatMap(i => i.verbindungen.map(v => ({...v, ...v.verbindung})));
		}
		const verbindungen = Number.isInteger(opt.results) && opt.results != 3 ? res.verbindungen.slice(0, opt.results) : res.verbindungen; // TODO remove default from hafas-rest-api
		const journeys = verbindungen
			.map(j => profile.parseJourney(ctx, j));
		if (opt.bestprice) {
			journeys.sort((a, b) => a.price?.amount - b.price?.amount);
		}

		return {
			earlierRef: res.verbindungReference?.earlier || res.frueherContext || null,
			laterRef: res.verbindungReference?.later || res.spaeterContext || null,
			journeys,
			realtimeDataUpdatedAt: null, // TODO
		};
	};

	const refreshJourney = async (refreshToken, opt = {}) => {
		await applyEnrichedStationData({profile, common}, shouldLoadEnrichedStationData);

		if ('string' !== typeof refreshToken || !refreshToken) {
			throw new TypeError('refreshToken must be a non-empty string.');
		}

		opt = Object.assign({
			stopovers: false, // return stations on the way?
			tickets: false, // return tickets?
			polylines: false, // return leg shapes? (not supported by all endpoints)
			subStops: true, // parse & expose sub-stops of stations?
			entrances: true, // parse & expose entrances of stops/stations?
			remarks: true, // parse & expose hints & warnings?
			scheduledDays: false, // parse & expose dates the journey is valid on?
			deutschlandTicketDiscount: false,
			deutschlandTicketConnectionsOnly: false,
			bmisNumber: null, // 7-digit BMIS number for business customer rates
		}, opt);

		const req = profile.formatRefreshJourneyReq({profile, opt}, refreshToken);

		const {res} = await profile.request({profile, opt}, userAgent, req);
		const ctx = {profile, opt, common, res};

		return {
			journey: profile.parseJourney(ctx, res.verbindungen && res.verbindungen[0] || res),
			realtimeDataUpdatedAt: null, // TODO
		};
	};

	const locations = async (query, opt = {}) => {
		await applyEnrichedStationData({profile, common}, shouldLoadEnrichedStationData);

		if (!isNonEmptyString(query)) {
			throw new TypeError('query must be a non-empty string.');
		}
		opt = Object.assign({
			fuzzy: true, // find only exact matches?
			results: 5, // how many search results?
			stops: true, // return stops/stations?
			addresses: true,
			poi: true, // points of interest
			subStops: true, // parse & expose sub-stops of stations?
			entrances: true, // parse & expose entrances of stops/stations?
			linesOfStops: false, // parse & expose lines at each stop/station?
		}, opt);
		const req = profile.formatLocationsReq({profile, opt}, query);

		const {res} = await profile.request({profile, opt}, userAgent, req);

		const ctx = {profile, opt, common, res};
		const results = res.map(loc => profile.parseLocation(ctx, loc));

		return Number.isInteger(opt.results)
			? results.slice(0, opt.results)
			: results;
	};

	const stop = async (stop, opt = {}) => {
		await applyEnrichedStationData({profile, common}, shouldLoadEnrichedStationData);

		if (isObj(stop) && stop.id) {
			stop = stop.id;
		} else if ('string' !== typeof stop) {
			throw new TypeError('stop must be an object or a string.');
		}

		opt = Object.assign({
			linesOfStops: false, // parse & expose lines at the stop/station?
			subStops: true, // parse & expose sub-stops of stations?
			entrances: true, // parse & expose entrances of stops/stations?
			remarks: true, // parse & expose hints & warnings?
		}, opt);

		const req = profile.formatStopReq({profile, opt}, stop);

		const {res} = await profile.request({profile, opt}, userAgent, req);
		const ctx = {profile, opt, res, common};
		return profile.parseStop(ctx, res, stop);
	};

	const nearby = async (location, opt = {}) => {
		await applyEnrichedStationData({profile, common}, shouldLoadEnrichedStationData);

		validateLocation(location, 'location');

		opt = Object.assign({
			results: 8, // maximum number of results
			distance: null, // maximum walking distance in meters
			poi: false, // return points of interest?
			stops: true, // return stops/stations?
			subStops: true, // parse & expose sub-stops of stations?
			entrances: true, // parse & expose entrances of stops/stations?
			linesOfStops: false, // parse & expose lines at each stop/station?
		}, opt);

		const req = profile.formatNearbyReq({profile, opt}, location);
		const {res} = await profile.request({profile, opt}, userAgent, req);

		const ctx = {profile, opt, common, res};
		const results = res.map(loc => {
			const res = profile.parseLocation(ctx, loc);
			if (res.latitude || res.location?.latitude) {
				res.distance = Math.round(distance(location.latitude, location.longitude, res.latitude || res.location?.latitude, res.longitude || res.location?.longitude) * 1000);
			}
			return res;
		});

		return Number.isInteger(opt.results)
			? results.slice(0, opt.results)
			: results;
	};

	const trip = async (id, opt = {}) => {
		await applyEnrichedStationData({profile, common}, shouldLoadEnrichedStationData);

		if (!isNonEmptyString(id)) {
			throw new TypeError('id must be a non-empty string.');
		}
		opt = Object.assign({
			stopovers: true, // return stations on the way?
			polyline: false, // return a track shape?
			subStops: true, // parse & expose sub-stops of stations?
			entrances: true, // parse & expose entrances of stops/stations?
			remarks: true, // parse & expose hints & warnings?
			scheduledDays: false, // parse & expose dates trip is valid on?
		}, opt);

		const req = profile.formatTripReq({profile, opt}, id);

		const {res} = await profile.request({profile, opt}, userAgent, req);
		const ctx = {profile, opt, common, res};

		const trip = profile.parseTrip(ctx, res, id);

		return {
			trip,
			realtimeDataUpdatedAt: null, // TODO
		};
	};

	// todo [breaking]: rename to trips()?
	const tripsByName = async (_lineNameOrFahrtNr = '*', _opt = {}) => {
		await applyEnrichedStationData({profile, common}, shouldLoadEnrichedStationData);

		throw new Error('not implemented');
	};

	const client = {
		departures,
		arrivals,
		journeys,
		locations,
		stop,
		nearby,
	};
	if (profile.trip) {
		client.trip = trip;
	}
	if (profile.refreshJourney) {
		client.refreshJourney = refreshJourney;
	}
	if (profile.tripsByName) {
		client.tripsByName = tripsByName;
	}
	Object.defineProperty(client, 'profile', {value: profile});
	return client;
};

const createBusinessClient = (profile, userAgent, bmisNumber, opt = {}) => {
	if (!bmisNumber || typeof bmisNumber !== 'string') {
		throw new TypeError('bmisNumber must be a non-empty string');
	}

	// Create a client with BMIS number included in all journey requests
	const client = createClient(profile, userAgent, opt);

	// Wrap journeys method to always include BMIS number
	const originalJourneys = client.journeys;
	client.journeys = async (from, to, opt = {}) => {
		return originalJourneys(from, to, {...opt, bmisNumber});
	};

	// Wrap refreshJourney method to always include BMIS number
	if (client.refreshJourney) {
		const originalRefreshJourney = client.refreshJourney;
		client.refreshJourney = async (refreshToken, opt = {}) => {
			return originalRefreshJourney(refreshToken, {...opt, bmisNumber});
		};
	}

	return client;
};

export {
	createClient,
	createBusinessClient,
	loadEnrichedStationData,
};
