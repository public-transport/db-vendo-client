import baseProfile from './base.json' with { type: "json" };
import {products} from '../../lib/products.js';
import {formatTripReq} from './trip-req.js';

const profile = {
	...baseProfile,
	locale: 'de-DE',
	timezone: 'Europe/Berlin',

	products,
	formatTripReq,
};

export {
	profile,
};
