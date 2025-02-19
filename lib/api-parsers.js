import {data as cards} from '../format/loyalty-cards.js';
import {parseBoolean, parseInteger} from 'hafas-rest-api/lib/parse.js';

const typesByName = new Map([
	['bahncard-1st-25', {type: cards.BAHNCARD, discount: 25, class: 1}],
	['bahncard-2nd-25', {type: cards.BAHNCARD, discount: 25, class: 2}],
	['bahncard-1st-50', {type: cards.BAHNCARD, discount: 50, class: 1}],
	['bahncard-2nd-50', {type: cards.BAHNCARD, discount: 50, class: 2}],
	['bahncard-1st-100', {type: cards.BAHNCARD, discount: 100, class: 1}],
	['bahncard-2nd-100', {type: cards.BAHNCARD, discount: 100, class: 2}],
	['vorteilscard', {type: cards.VORTEILSCARD}],
	['halbtaxabo-railplus', {type: cards.HALBTAXABO}],
	['halbtaxabo', {type: cards.HALBTAXABO}],
	['voordeelurenabo-railplus', {type: cards.VOORDEELURENABO}],
	['voordeelurenabo', {type: cards.VOORDEELURENABO}],
	['shcard', {type: cards.SHCARD}],
	['generalabonnement-1st', {type: cards.GENERALABONNEMENT, class: 1}],
	['generalabonnement-2nd', {type: cards.GENERALABONNEMENT, class: 2}],
	['generalabonnement', {type: cards.GENERALABONNEMENT}],
	['nl-40', {type: cards.NL_40}],
	['at-klimaticket', {type: cards.AT_KLIMATICKET}],
]);
const types = Array.from(typesByName.keys());

const parseLoyaltyCard = (key, val) => {
	if (typesByName.has(val)) {
		return typesByName.get(val);
	}
	if (!val) {
		return null;
	}
	throw new Error(key + ' must be one of ' + types.join(', '));
};

const parseArrayOr = (parseEntry) => {
	return (key, val) => {
		if (Array.isArray(val)) {
			return val.map(e => parseEntry(key, e));
		}
		return parseEntry(key, val);
	};
};

const mapRouteParsers = (route, parsers) => {
	if (route !== 'journeys') {
		return parsers;
	}
	return {
		...parsers,
		firstClass: {
			description: 'Search for first-class options?',
			type: 'boolean',
			default: 'false',
			parse: parseBoolean,
		},
		loyaltyCard: {
			description: 'Type of loyalty card in use.',
			type: 'string',
			enum: types,
			defaultStr: '*none*',
			parse: parseArrayOr(parseLoyaltyCard),
		},
		age: {
			description: 'Age of traveller',
			type: 'integer',
			defaultStr: '*adult*',
			parse: parseArrayOr(parseInteger),
		},
	};
};

export {
	mapRouteParsers,
};
