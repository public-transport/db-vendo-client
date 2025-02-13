// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/dbnav/index.js';
import res from './fixtures/dbnav-trip.json' with { type: "json" };
import {dbTrip as expected} from './fixtures/dbnav-trip.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test', {enrichStations: false});
const {profile} = client;

const opt = {
	stopovers: true,
	remarks: true,

	products: {},
};

tap.test('parses a trip correctly (DBnav)', (t) => {
	const ctx = {profile, opt, common: null, res};
	const trip = profile.parseTrip(ctx, res, 'foo');

	t.same(trip, expected.trip);
	// console.log(JSON.stringify(trip,  function(k, v) { return v === undefined ? "undefined" : v; }));
	t.end();
});
