import tap from 'tap';
import isRoughlyEqual from 'is-roughly-equal';

import {createWhen} from './lib/util.js';
import {createClient} from '../../index.js';
import {profile as dbProfile} from '../../p/dbbahnhof/index.js';
import {
	createValidateStation,
	createValidateTrip,
} from './lib/validators.js';
import {createValidateFptfWith as createValidate} from './lib/validate-fptf-with.js';
import {testJourneysStationToStation} from './lib/journeys-station-to-station.js';
import {testJourneysStationToAddress} from './lib/journeys-station-to-address.js';
import {testJourneysStationToPoi} from './lib/journeys-station-to-poi.js';
import {testEarlierLaterJourneys} from './lib/earlier-later-journeys.js';
import {testLegCycleAlternatives} from './lib/leg-cycle-alternatives.js';
import {testRefreshJourney} from './lib/refresh-journey.js';
import {journeysFailsWithNoProduct} from './lib/journeys-fails-with-no-product.js';
import {testDepartures} from './lib/departures.js';
import {testArrivals} from './lib/arrivals.js';
import {testJourneysWithDetour} from './lib/journeys-with-detour.js';

const isObj = o => o !== null && 'object' === typeof o && !Array.isArray(o);
const minute = 60 * 1000;

const T_MOCK = 1764831628 * 1000; // Thu Dec 04 2025 07:00:28 GMT+0000
const when = createWhen(dbProfile.timezone, dbProfile.locale, T_MOCK);

const cfg = {
	when,
	stationCoordsOptional: true, // TODO
	products: dbProfile.products,
	minLatitude: 46.673100,
	maxLatitude: 55.030671,
	minLongitude: 6.896517,
	maxLongitude: 16.180237,
};

const validate = createValidate(cfg);

const assertValidPrice = (t, p) => {
	t.ok(p);
	if (p.amount !== null) {
		t.equal(typeof p.amount, 'number');
		t.ok(p.amount > 0);
	}
	if (p.hint !== null) {
		t.equal(typeof p.hint, 'string');
		t.ok(p.hint);
	}
};

const assertValidTickets = (test, tickets) => {
	test.ok(Array.isArray(tickets));
	for (let fare of tickets) {
		test.equal(typeof fare.name, 'string', 'Mandatory field "name" is missing or not a string');
		test.ok(fare.name);

		test.ok(isObj(fare.priceObj), 'Mandatory field "priceObj" is missing or not an object');
		test.equal(typeof fare.priceObj.amount, 'number', 'Mandatory field "amount" in "priceObj" is missing or not a number');
		test.ok(fare.priceObj.amount > 0);
		if ('currency' in fare.priceObj) {
			test.equal(typeof fare.priceObj.currency, 'string');
		}

		// Check optional fields
		if ('addData' in fare) {
			test.equal(typeof fare.addData, 'string');
		}
		if ('addDataTicketInfo' in fare) {
			test.equal(typeof fare.addDataTicketInfo, 'string');
		}
		if ('addDataTicketDetails' in fare) {
			test.equal(typeof fare.addDataTicketDetails, 'string');
		}
		if ('addDataTravelInfo' in fare) {
			test.equal(typeof fare.addDataTravelInfo, 'string');
		}
		if ('addDataTravelDetails' in fare) {
			test.equal(typeof fare.firstClass, 'boolean');
		}
	}
};

const client = createClient(dbProfile, 'public-transport/hafas-client:test', {enrichStations: false});

const berlinHbf = '8011160';
const münchenHbf = '8000261';
const jungfernheide = '8011167';
const blnSchwedterStr = '732652';
const westhafen = '8089116';
const wedding = '8089131';
const württembergallee = '731084';
const regensburgHbf = '8000309';
const blnOstbahnhof = '8010255';
const blnTiergarten = '8089091';
const blnJannowitzbrücke = '8089019';
const potsdamHbf = '8012666';
const berlinSüdkreuz = '8011113';
const kölnHbf = '8000207';


tap.skip('departures at Berlin Schwedter Str.', async (t) => {
	const res = await client.departures(blnSchwedterStr, {
		duration: 5, when,
	});

	await testDepartures({
		test: t,
		res,
		validate,
		id: blnSchwedterStr,
	});
	t.end();
});

tap.skip('departures with station object', async (t) => {
	const res = await client.departures({
		type: 'station',
		id: jungfernheide,
		name: 'Berlin Jungfernheide',
		location: {
			type: 'location',
			latitude: 1.23,
			longitude: 2.34,
		},
	}, {when});

	validate(t, res, 'departuresResponse', 'res');
	t.end();
});

tap.skip('arrivals at Berlin Schwedter Str.', async (t) => {
	const res = await client.arrivals(blnSchwedterStr, {
		duration: 5, when,
	});

	await testArrivals({
		test: t,
		res,
		validate,
		id: blnSchwedterStr,
	});
	t.end();
});

