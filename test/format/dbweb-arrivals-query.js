import tap from 'tap';

import {createClient} from '../../index.js';
import {profile as rawProfile} from '../../p/dbweb/index.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test');
const {profile} = client;

const opt = {
	when: new Date('2025-02-09T23:55:00+01:00'),
	remarks: true,
	stopovers: true,
	language: 'en',
};

const berlinArrivalsQuery = {
	endpoint: 'https://int.bahn.de/web/api/reiseloesung/',
	path: 'ankuenfte',
	query: {
		ortExtId: '8011160',
		zeit: '23:55',
		datum: '2025-02-09',
		mitVias: true,
		verkehrsmittel: [
			'ICE',
			'EC_IC',
			'IR',
			'REGIONAL',
			'SBAHN',
			'BUS',
			'SCHIFF',
			'UBAHN',
			'TRAM',
			'ANRUFPFLICHTIG',
		],
	},
	method: 'GET',
};

tap.test('formats an arrivals() request correctly', (t) => {
	const ctx = {profile, opt};

	const req = profile.formatStationBoardReq(ctx, '8011160', 'arrivals');

	t.same(req, berlinArrivalsQuery);
	t.end();
});
