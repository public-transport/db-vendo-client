// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/db/index.js';
const res = require('./fixtures/db-departures.json');
import {dbDepartures as expected} from './fixtures/db-departures.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test', {enrichStations: false});
const {profile} = client;

const opt = {
	direction: null,
	duration: 10,
	linesOfStops: true,
	remarks: true,
	stopovers: true,
	includeRelatedStations: true,
	when: '2025-02-05T15:00:00',
	products: {},
	vias: 5,
};

tap.test('parses a db departure correctly', (t) => {
	const ctx = {profile, opt, common: null, res};
	const departures = res.entries.map(d => profile.parseDeparture(ctx, d));

	t.same(departures, expected);
	t.end();
});
