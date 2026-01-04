import tap from 'tap';

import {createClient} from '../../index.js';
import {profile as rawProfile} from '../../p/dbnav/index.js';
import {data as loyaltyCards} from '../../format/loyalty-cards.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test', {enrichStations: false});
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
		autonomeReservierung: false,
		reservierungsKontingenteVorhanden: false,
		einstiegsTypList: [
			'STANDARD',
		],
		fahrverguenstigungen: {
			deutschlandTicketVorhanden: undefined,
			nurDeutschlandTicketVerbindungen: undefined,
		},
		klasse: 'KLASSE_2',
		reiseHin: {
			wunsch: {
				abgangsLocationId: 'A=1@L=8098160@',
				verkehrsmittel: [
					'ALL',
				],
				alternativeHalteBerechnung: true,
				zeitWunsch: {
					reiseDatum: '2024-12-07T23:50:12+01:00',
					zeitPunktArt: 'ABFAHRT',
				},
				viaLocations: undefined,
				zielLocationId: 'A=1@L=8000284@',
				maxUmstiege: undefined,
				minUmstiegsdauer: undefined,
				fahrradmitnahme: false,
			},
		},
	});

tap.test('formats a journeys() request correctly (DBnav)', (t) => {
	const _opt = {...opt};
	delete _opt.loyaltyCard;
	delete _opt.age;
	const ctx = {profile, opt: _opt};

	const req = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);
	t.same(req.body, {
		...berlinWienQuery0,
		reisendenProfil: {
			reisende: [
				{
					ermaessigungen: [
						'KEINE_ERMAESSIGUNG KLASSENLOS',
					],
					reisendenTyp: 'ERWACHSENER',
					alter: undefined,
				},
			],
		},
	});
	t.end();
});


tap.test('formats a journeys() request with BC correctly (DBnav)', (t) => {
	const ctx = {profile, opt};

	const req = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);

	t.same(req.body, {
		...berlinWienQuery0,
		reisendenProfil: {
			reisende: [
				{
					ermaessigungen: [
						'BAHNCARD25 KLASSE_2',
					],
					reisendenTyp: 'JUGENDLICHER',
					alter: 24,
				},
			],
		},
	});
	t.end();
});

tap.test('formats a journeys() request with unlimited transfers (DBnav)', (t) => {
	const _opt = {...opt};
	const ctx = {profile, opt: _opt};

	ctx.opt.transfers = 1; // 1 transfer
	const reqOneTransfer = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);
	t.equal(reqOneTransfer.body.reiseHin.wunsch.maxUmstiege, 1);

	ctx.opt.transfers = 0; // no transfers
	const reqZeroTransfers = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);
	t.equal(reqZeroTransfers.body.reiseHin.wunsch.maxUmstiege, 0);

	ctx.opt.transfers = null; // unconstrained transfers implicit
	const reqUnlimitedTransfersImplicitNull = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);
	t.equal(reqUnlimitedTransfersImplicitNull.body.reiseHin.wunsch.maxUmstiege, undefined);

	ctx.opt.transfers = undefined; // unconstrained transfers implicit
	const reqUnlimitedTransfersImplicit = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);
	t.equal(reqUnlimitedTransfersImplicit.body.reiseHin.wunsch.maxUmstiege, undefined);

	ctx.opt.transfers = -1; // unconstrained transfers explicit
	const reqUnlimitedTransfersExplicit = profile.formatJourneysReq(ctx, '8098160', '8000284', new Date('2024-12-07T23:50:12+01:00'), true, null);
	t.equal(reqUnlimitedTransfersExplicit.body.reiseHin.wunsch.maxUmstiege, undefined);

	t.end();
});
