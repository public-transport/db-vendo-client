import tap from 'tap';

import {createClient} from '../../index.js';
import {profile as rawProfile} from '../../p/db/index.js';
import {data as loyaltyCards} from '../../format/loyalty-cards.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test');
const {profile} = client;

const opt = {
	results: null,
	via: null,
	stopovers: false,
	transfers: null,
	transferTime: 0,
	accessibility: 'none',
	bike: false,
	walkingSpeed: 'normal',
	startWithWalking: true,
	tickets: false,
	polylines: false,
	subStops: true,
	entrances: true,
	remarks: true,
	scheduledDays: false,
	departure: '2023-09-12T08:09:10+02:00',
	products: {},

	firstClass: false,
	age: 24,
	loyaltyCard: {
		type: loyaltyCards.BAHNCARD,
		discount: 25,
	},
};

const berlinWienQuery0 = Object.freeze(
	{
		abfahrtsHalt: 'A=1@L=8098160@',
		anfrageZeitpunkt: '2024-12-07T23:50:12',
		ankunftsHalt: 'A=1@L=8000284@',
		ankunftSuche: 'ABFAHRT',
		klasse: 'KLASSE_2',
		produktgattungen: [
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
		schnelleVerbindungen: true,
		sitzplatzOnly: false,
		bikeCarriage: false,
		reservierungsKontingenteVorhanden: false,
		nurDeutschlandTicketVerbindungen: false,
		deutschlandTicketVorhanden: false,
		maxUmstiege: null,
		zwischenhalte: null,
		minUmstiegszeit: 0,
	});

tap.test('formats a journeys() request correctly (DB)', (t) => {
	const _opt = {...opt};
	delete _opt.loyaltyCard;
	delete _opt.age;
	const ctx = {profile, opt: _opt};

	const req = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);
	t.same(req.body, {
		...berlinWienQuery0,
		reisende: [
			{
				typ: 'ERWACHSENER',
				ermaessigungen: [
					{
						art: 'KEINE_ERMAESSIGUNG',
						klasse: 'KLASSENLOS',
					},
				],
				alter: [],
				anzahl: 1,
			},
		],
	});
	t.end();
});


tap.test('formats a journeys() request with BC correctly (DB)', (t) => {
	const ctx = {profile, opt};

	const req = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);

	t.same(req.body, {
		...berlinWienQuery0,
		reisende: [
			{
				typ: 'JUGENDLICHER',
				ermaessigungen: [
					{
						art: 'BAHNCARD25',
						klasse: 'KLASSE_2',
					},
				],
				alter: ['24'],
				anzahl: 1,
			},
		],
	});
	t.end();
});

tap.test('formats a journeys() request with unlimited transfers (DB)', (t) => {
	const _opt = {...opt};
	const ctx = {profile, opt: _opt};

	ctx.opt.transfers = 0; // no transfers
	const reqZeroTransfers = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);
	t.equal(reqZeroTransfers.body.maxUmstiege, 0);

	ctx.opt.transfers = undefined; // unconstrained transfers implicit
	const reqUnlimitedTransfersImplicit = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);
	t.equal(reqUnlimitedTransfersImplicit.body.maxUmstiege, undefined);

	ctx.opt.transfers = -1; // unconstrained transfers explicit
	const reqUnlimitedTransfersExplicit = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);
	t.equal(reqUnlimitedTransfersExplicit.body.maxUmstiege, undefined);

	t.end();
});
