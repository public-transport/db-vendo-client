// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/dbweb/index.js';
const res = require('./fixtures/dbris-arrivals.json');
import {dbArrivals as expected} from './fixtures/dbris-arrivals.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test', {enrichStations: false});
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

tap.test('parses a RIS::Boards arrival correctly', (t) => {
	const ctx = {profile, opt, common: null, res};
	const arrivals = res.arrivals.map(d => profile.parseArrival(ctx, d));

	t.same(arrivals, expected);
	t.end();
});
