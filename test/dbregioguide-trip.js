// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/dbregioguide/index.js';
const res = require('./fixtures/dbregioguide-trip.json');
import {dbTrip as expected} from './fixtures/dbregioguide-trip.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test', {enrichStations: false});
const {profile} = client;

const opt = {
	stopovers: true,
	remarks: true,
	products: {},
};

tap.test('parses a regio guide trip correctly (DB)', (t) => {
	const ctx = {profile, opt, common: null, res};
	const trip = profile.parseTrip(ctx, res, 'foo');

	t.same(trip, expected.trip);
	t.end();
});
