import baseProfile from './base.json' with { type: 'json' };
import {products} from '../../lib/products.js';
import {formatTripReq} from './trip-req.js';
import {formatStationBoardReq} from './station-board-req.js';

const profile = {
	...baseProfile,
	locale: 'de-DE',
	timezone: 'Europe/Berlin',

	products,
	formatTripReq,
	formatStationBoardReq,

	journeysOutFrwd: false,
	departuresGetPasslist: false,
	departuresStbFltrEquiv: true,
	trip: true,
	radar: false,
	refreshJourney: false,
	journeysFromTrip: false,
	refreshJourneyUseOutReconL: false,
	tripsByName: false,
	remarks: false,
	remarksGetPolyline: false,
	reachableFrom: false,
	lines: false,
};

export {
	profile,
};
