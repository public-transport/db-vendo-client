import {request} from '../lib/request.js';
import {products} from '../lib/products.js';
import {ageGroup, ageGroupFromAge, ageGroupLabel} from './age-group.js';

import {formatStationBoardReq} from '../format/station-board-req.js';
import {formatTripReq} from '../format/trip-req.js';
import {formatNearbyReq} from '../format/nearby-req.js';

import {parseDateTime} from '../parse/date-time.js';
import {parsePlatform} from '../parse/platform.js';
import {parseProducts} from '../parse/products.js';
import {parseWhen} from '../parse/when.js';
import {parseDeparture} from '../parse/departure.js';
import {parseArrival} from '../parse/arrival.js';
import {parseTrip} from '../parse/trip.js';
import {parseJourneyLeg} from '../parse/journey-leg.js';
import {parseJourney} from '../parse/journey.js';
import {parseLine} from '../parse/line.js';
import {parseLocation} from '../parse/location.js';
import {parsePolyline} from '../parse/polyline.js';
import {parseOperator} from '../parse/operator.js';
import {parseRemarks, parseCancelled} from '../parse/remarks.js';
import {parseStopover} from '../parse/stopover.js';
import {parseLoadFactor, parseArrOrDepWithLoadFactor} from '../parse/load-factor.js';
import {parseHintByCode} from '../parse/hints-by-code.js';
import {parseTickets, parsePrice} from '../parse/tickets.js';

import {formatAddress} from '../format/address.js';
import {formatCoord} from '../format/coord.js';
import {formatDate} from '../format/date.js';
import {formatProductsFilter} from '../format/products-filter.js';
import {formatPoi} from '../format/poi.js';
import {formatStation} from '../format/station.js';
import {formatTime, formatTimeOfDay} from '../format/time.js';
import {formatLocation} from '../format/location.js';
import {formatTravellers} from '../format/travellers.js';
import {formatLoyaltyCard} from '../format/loyalty-cards.js';
import {formatTransfers} from '../format/transfers.js';

const DEBUG = (/(^|,)hafas-client(,|$)/).test(process?.env?.DEBUG ?? '');
const logRequest = DEBUG
	? (_, req, reqId) => console.error(String(req.body))
	: () => { };
const logResponse = DEBUG
	? (_, res, body, reqId) => console.error(body)
	: () => { };

const id = (_ctx, x) => x;
const notImplemented = (_ctx, _x) => {
	throw new Error('NotImplemented');
};

const defaultProfile = {
	DEBUG,
	request,
	products,
	ageGroup, ageGroupFromAge, ageGroupLabel,
	transformReqBody: id,
	transformReq: id,
	randomizeUserAgent: false,
	logRequest,
	logResponse,

	formatStationBoardReq,
	formatLocationsReq: notImplemented,
	formatStopReq: notImplemented,
	formatTripReq,
	formatNearbyReq,
	formatJourneysReq: notImplemented,
	formatRefreshJourneyReq: notImplemented,
	transformJourneysQuery: id,

	parseDateTime,
	parsePlatform,
	parseProducts,
	parseWhen,
	parseDeparture,
	parseArrival,
	parseTrip,
	parseJourneyLeg,
	parseJourney,
	parseLine,
	parseStationName: id,
	parseLocation,
	parsePolyline,
	parseOperator,
	parseRemarks,
	parseCancelled,
	parseStopover,
	parseLoadFactor,
	parseArrOrDepWithLoadFactor,
	parseHintByCode,
	parsePrice,
	parseTickets,
	parseStop: notImplemented,

	formatAddress,
	formatCoord,
	formatDate,
	formatLocation,
	formatLocationFilter: notImplemented,
	formatLoyaltyCard,
	formatPoi,
	formatProductsFilter,
	formatStation,
	formatTime,
	formatTimeOfDay,
	formatTransfers,
	formatTravellers,
	formatRectangle: id,

	journeysOutFrwd: true,
	departuresGetPasslist: false,
	departuresStbFltrEquiv: false,
	trip: true,
	radar: false,
	refreshJourney: true,
	journeysFromTrip: false,
	refreshJourneyUseOutReconL: false,
	tripsByName: false,
	remarks: false,
	remarksGetPolyline: false,
	reachableFrom: false,
	lines: false,
};

export {
	defaultProfile,
};
