import tap from 'tap';

import {createClient} from '../../index.js';
import {profile as rawProfile} from '../../p/db/index.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test');
const {profile} = client;

const opt = {
	when: new Date('2025-02-09T23:55:00+01:00'),
	remarks: true,
	stopovers: false,
	vias: 0,
	language: 'en',
};

const berlinArrivalsQuery = {
	endpoint: 'https://int.bahn.de/web/api/reiseloesung/',
	path: 'ankuenfte',
	query: {
		ortExtId: '8011160',
		zeit: '23:55',
		datum: '2025-02-09',
		mitVias: undefined,
		maxVias: 0,
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

tap.test('formats an arrivals() request with different vias option', (t) => {
	const _opt = {...opt};
	const ctx = {profile, opt: _opt};

	ctx.opt.vias = undefined;
	const reqViasUndefined = profile.formatStationBoardReq(ctx, '8011160', 'arrivals');
	t.equal(reqViasUndefined.query.mitVias, undefined);
	t.equal(reqViasUndefined.query.maxVias, 0);

	ctx.opt.vias = null;
	const reqViasNull = profile.formatStationBoardReq(ctx, '8011160', 'arrivals');
	t.equal(reqViasNull.query.mitVias, undefined);
	t.equal(reqViasNull.query.maxVias, 0);

	ctx.opt.vias = 42;
	const reqViasFourtyTwo = profile.formatStationBoardReq(ctx, '8011160', 'arrivals');
	t.equal(reqViasFourtyTwo.query.mitVias, true);
	t.equal(reqViasFourtyTwo.query.maxVias, 42);

	t.end();
});
