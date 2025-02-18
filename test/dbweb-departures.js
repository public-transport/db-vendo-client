// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import tap from 'tap';

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/dbweb/index.js';
import res from './fixtures/dbweb-departures.json' with { type: 'json' };
import {dbwebDepartures as expected} from './fixtures/dbweb-departures.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test', {enrichStations: true});
const {profile} = client;

const opt = {
	direction: null,
	duration: null,
	linesOfStops: true,
	remarks: true,
	stopovers: true,
	includeRelatedStations: true,
	when: '2025-02-08T15:37:00',
	products: {},
};

const osterburken = {
	type: 'station',
	id: '8000295',
	name: 'Osterburken',
	location: {
		type: 'location',
		id: '8000295',
		latitude: 49.42992,
		longitude: 9.422996,
	},
	products: {
		nationalExpress: false,
		national: false,
		regionalExp: false,
		regional: true,
		suburban: true,
		bus: true,
		ferry: false,
		subway: false,
		tram: false,
		taxi: true,
	},
	weight: 5.6,
};

const moeckmuehl = {
	type: 'station',
	id: '8004050',
	name: 'Möckmühl',
	location: {
		type: 'location',
		id: '8004050',
		latitude: 49.321187,
		longitude: 9.357977,
	},
	products: {
		nationalExpress: false,
		national: false,
		regionalExp: false,
		regional: true,
		suburban: false,
		bus: true,
		ferry: false,
		subway: false,
		tram: false,
		taxi: false,
	},
	distance: 2114,
	weight: 6.45,
};

const common = {
	locations: {
		Osterburken: osterburken,
		8000295: osterburken,
		Möckmühl: moeckmuehl,
	},
};

tap.test('parses a dbweb departure correctly', (t) => {
	const ctx = {profile, opt, common, res};
	const departures = res.entries.map(d => profile.parseDeparture(ctx, d));

	t.same(departures, expected);
	t.end();
});
