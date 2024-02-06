// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/db/index.js';
const res = require('./fixtures/db-arrivals.json');
import {dbArrivals as expected} from './fixtures/db-arrivals.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test');
const {profile} = client;

const opt = {
	direction: null,
	duration: 10,
	linesOfStops: true,
	remarks: true,
	stopovers: true,
	includeRelatedStations: true,
	when: '2019-08-19T20:30:00+02:00',
	products: {},
};

tap.test('parses an arrival correctly (DB)', (t) => {
	const common = profile.parseCommon({profile, opt, res});
	const ctx = {profile, opt, common, res};
	const arrivals = res.jnyL.map(d => profile.parseArrival(ctx, d));

	t.same(arrivals, expected);
	t.end();
});
