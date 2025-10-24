import base from './base.json' with { type: 'json' };
import {products} from '../../lib/products.js';

// journeys()
import {formatJourneysReq} from '../dbnav/journeys-req.js';
const {journeysEndpoint} = base;
const {bestpriceEndpoint} = base;

// refreshJourneys()
import {formatRefreshJourneyReq} from '../dbnav/journeys-req.js';
const {refreshJourneysEndpointTickets, refreshJourneysEndpointPolyline} = base;

// locations()
import {formatLocationsReq} from '../dbnav/locations-req.js';
import {formatLocationFilter} from '../dbnav/location-filter.js';
const {locationsEndpoint} = base;

// stop()
import {formatStopReq} from '../dbnav/stop-req.js';
import {parseStop} from '../dbnav/parse-stop.js';
const {stopEndpoint} = base;

// nearby()
import {formatNearbyReq} from '../dbnav/nearby-req.js';
const {nearbyEndpoint} = base;

// trip()
import {formatTripReq} from './trip-req.js';
const {tripEndpoint} = base;

// arrivals(), departures()
import {formatStationBoardReq} from '../dbnav/station-board-req.js';
const {boardEndpoint} = base;

const profile = {
	locale: 'de-DE',
	timezone: 'Europe/Berlin',

	products,

	formatJourneysReq,
	journeysEndpoint,
	bestpriceEndpoint,

	formatRefreshJourneyReq,
	refreshJourneysEndpointTickets, refreshJourneysEndpointPolyline,

	formatLocationsReq, formatLocationFilter,
	locationsEndpoint,

	formatStopReq, parseStop,
	stopEndpoint,

	formatNearbyReq,
	nearbyEndpoint,

	formatTripReq,
	tripEndpoint,

	formatStationBoardReq,
	boardEndpoint,
};


export {
	profile,
};
