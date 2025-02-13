import dbnavBase from '../dbnav/base.json' with { type: "json" };
import dbregioguideBase from '../dbregioguide/base.json' with { type: "json" };
import {products} from '../../lib/products.js';

// journeys()
import {formatJourneysReq} from '../dbnav/journeys-req.js';
const {journeysEndpoint} = dbnavBase;

// refreshJourneys()
import {formatRefreshJourneyReq} from '../dbnav/journeys-req.js';
const {refreshJourneysEndpointTickets, refreshJourneysEndpointPolyline} = dbnavBase;

// locations()
import {formatLocationsReq} from '../dbnav/locations-req.js';
import {formatLocationFilter} from '../dbnav/location-filter.js';
const {locationsEndpoint} = dbnavBase;

// stop()
import {formatStopReq} from '../dbnav/stop-req.js';
import {parseStop} from '../dbnav/parse-stop.js';
const {stopEndpoint} = dbnavBase;

// nearby()
import {formatNearbyReq} from '../dbnav/nearby-req.js';
const {nearbyEndpoint} = dbnavBase;

// trip()
import {formatTripReq} from './trip-req.js';
const tripEndpoint_dbnav = dbnavBase.tripEndpoint;
const tripEndpoint_dbregioguide = dbregioguideBase.tripEndpoint;

// arrivals(), departures()
const {boardEndpoint} = dbregioguideBase;

const profile = {
	locale: 'de-DE',
	timezone: 'Europe/Berlin',

	products,

	formatJourneysReq,
	journeysEndpoint,

	formatRefreshJourneyReq,
	refreshJourneysEndpointTickets, refreshJourneysEndpointPolyline,

	formatLocationsReq, formatLocationFilter,
	locationsEndpoint,

	formatStopReq, parseStop,
	stopEndpoint,

	formatNearbyReq,
	nearbyEndpoint,

	formatTripReq,
	tripEndpoint_dbnav, tripEndpoint_dbregioguide,

	boardEndpoint,
};


export {
	profile,
};
