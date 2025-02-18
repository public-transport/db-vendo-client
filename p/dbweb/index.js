import baseProfile from './base.json' with { type: 'json' };
import {products} from '../../lib/products.js';
import {formatJourneysReq, formatRefreshJourneyReq} from './journeys-req.js';
import {formatLocationFilter} from './location-filter.js';
import {formatLocationsReq} from './locations-req.js';
import {formatStationBoardReq} from './station-board-req.js';

const profile = {
	...baseProfile,
	locale: 'de-DE',
	timezone: 'Europe/Berlin',

	products,

	formatJourneysReq,
	formatRefreshJourneyReq,
	formatLocationsReq,
	formatLocationFilter,
	formatStationBoardReq,

	departuresGetPasslist: true,
};

export {
	profile,
};
