import tap from 'tap';
import {parseJourney as parseJourneyDbnav} from '../../p/dbnav/parse-journey.js';
import {parseJourney as parseJourneyDefault} from '../../parse/journey.js';
import {parseJourneyLeg} from '../../parse/journey-leg.js';
import {parseWhen} from '../../parse/when.js';
import {parseDateTime} from '../../parse/date-time.js';
import {parsePlatform} from '../../parse/platform.js';

const ctx = {
	opt: {},
	profile: {
		enrichStation: (ctx, stop) => stop,
		parseCancelled: _ => null,
		parseDateTime,
		parseJourneyLeg,
		parseLine: _ => null,
		parseLoadFactor: _ => null,
		parseLocation: _ => ({latitude: null, longitude: null}),
		parseOperator: _ => null,
		parsePlatform,
		parsePrice: _ => null,
		parseTickets: _ => null,
		parseWhen,
		timezone: 'Europe/Berlin',
		locale: 'de-DE',
	},
};

const input = {
	reiseDauer: 480,
	alternative: true,
	checksum: 'bfc0da75_3',
	umstiegeAnzahl: 0,
	schemaVersion: '1.23.8',
	schemaName: 'trip',
	kontext: '¶HKI¶G@F$A=4@O=Berlin, Fernsehturm (Tourismus)@X=13409694@Y=52521301@L=991671997@a=128@$A=1@O=Berlin Alexanderplatz@X=13410728@Y=52521409@L=618011155@a=128@$202503061452$202503061454$$$1$$$$$$§W$A=1@O=Berlin Alexanderplatz@X=13410728@Y=52521409@L=618011155@a=128@$A=1@O=Berlin Alexanderplatz@X=13410962@Y=52521481@L=8011155@a=128@$202503061454$202503061454$$$1$$$$$$§T$A=1@O=Berlin Alexanderplatz@X=13410962@Y=52521481@L=8011155@a=128@$A=1@O=Berlin Hbf@X=13369549@Y=52525589@L=8011160@a=128@$202503061454$202503061459$RE 73737$$1$$$$$$¶GP¶ft@0@2000@120@1@100@1@0@0@@@@@false@0@-1@0@-1@-1@$f@$f@$f@$f@$f@$§bt@0@2000@120@1@100@1@0@0@@@@@false@0@-1@0@-1@-1@$f@$f@$f@$f@$f@$§tf@$f@$f@$f@$f@$f@$§¶KC¶#VE#2#CF#100#CA#0#CM#0#SICT#0#AM#81#AM2#0#RT#7#¶KCC¶I1ZFIzEjRVJHIzIjSElOIzAjRUNLIzB8MHwwfDB8MHwwfDB8MHwwfDB8MHwwfDB8MCNHQU0jNjAzMjUxNDU0IwpGI1ZOIzAjU1QjMTc0MDU3ODc3MiNQSSMxI1BVIzkwI1pJIzMzNTU3OTIxMjQjREEjNjAzMjUjRlIjNjE4MDExMTU1I1RPIzgwMTExNTUjRlQjMTQ1NCNUVCMxNDU0I1RTIzMxI0ZGIyNGViMwI1NUIzE3NDEwMzIwNzkjUEkjMCNQVSM4MCMKWiNWTiMxI1NUIzE3NDEwMzIwNzkjUEkjMCNaSSM1NDI4NjMjVEEjMiNEQSM2MDMyNSMxUyM4MDEwMTEzIzFUIzEzNTUjTFMjODAxMDIyNCNMVCMxNjQ3I1BVIzgwI1JUIzEjQ0EjRFBOI1pFIzczNzM3I1pCI1JFIDczNzM3I1BDIzMjRlIjODAxMTE1NSNGVCMxNDU0I1RPIzgwMTExNjAjVFQjMTQ1OSM=¶KRCC¶#VE#1#VOLL#MRTF#IST#¶SC¶1_H4sIAAAAAAACA22PXUvDMBiF/8p4rxTqSPq1NVCoXSkoxY0xhiJehDXbKmkz8zEspf/dtFUQ9C7n8OSc83ZwZRII4PnSBwfYp7YiS+f7bI5da0j2AaSDxtQ5kMAZHikQ5IAwOqOaWdpFboA8FMJo7qp6MLEfBAhZ6zgm3GEH3ps251oWQF470O1lwDbbdWahWpSDenhaWXGl3IwRyPWgfxtHrc6nKdg2l+xSiMMUw6vSkvexn6zjlEleNc4sZ7JR7KyNrGc3O2FkpWqjbpMijiIcLnAULZLnGHs+isLIT17iwA1c7CGU2HKlp6PysZlK+acK26AlwhiH/3w4MZ1td0C0NGxUG8Fbu4r9sh7tpIa1qTBNqYAcKVffLFWKV0r/sOwgNlTS2kJd3/df/HilQasBAAA=',
	echtzeitNotizen: [],
	himNotizen: [],
	auslastungsInfos: [
		{
			klasse: 'KLASSE_1',
			stufe: 0,
			anzeigeTextKurz: 'No occupancy information available',
		},
		{
			klasse: 'KLASSE_2',
			stufe: 0,
			anzeigeTextKurz: 'No occupancy information available',
		},
	],
	serviceDays: [
		{
			irregular: 'not 8. until 19. Mar 2025',
			letztesDatumInZeitraum: '2025-12-13',
			planungsZeitraumAnfang: '2024-12-15',
			planungsZeitraumEnde: '2025-12-13',
			regular: 'daily',
			wochentage: [
				'DO',
				'FR',
			],
		},
	],
	verbindungsAbschnitte: [
		{
			reservierungsMeldungen: [],
			nummer: 0,
			abschnittsDauer: 120,
			typ: 'FUSSWEG',
			halte: [],
			distanz: 137,
			himNotizen: [],
			echtzeitNotizen: [],
			attributNotizen: [],
			abgangsOrt: {
				name: 'Berlin, Fernsehturm (Tourismus)',
				locationId: 'A=4@O=Berlin, Fernsehturm (Tourismus)@X=13409694@Y=52521301@U=91@L=991671997@',
				evaNr: '991671997',
				position: {
					latitude: 52.5213,
					longitude: 13.409694,
				},
			},
			abgangsDatum: '2025-03-06T14:52:00+01:00',
			ezAbgangsDatum: '2025-03-06T14:52:00Z', // upstream bug: wrong time zone offset
			ankunftsOrt: {
				name: 'Berlin Alexanderplatz',
				locationId: 'A=1@O=Berlin Alexanderplatz@X=13410962@Y=52521481@U=80@L=8011155@i=U×008003135@',
				evaNr: '8011155',
				position: {
					latitude: 52.521526,
					longitude: 13.411088,
				},
				stationId: '0053',
			},
			ankunftsDatum: '2025-03-06T14:54:00+01:00',
			ezAnkunftsDatum: '2025-03-06T14:54:00Z', // upstream bug: wrong time zone offset
			produktGattung: 'SONSTIGE',
			wagenreihung: false,
			auslastungsInfos: [
				{
					klasse: 'KLASSE_1',
					stufe: 0,
					anzeigeTextKurz: 'No occupancy information available',
				},
				{
					klasse: 'KLASSE_2',
					stufe: 0,
					anzeigeTextKurz: 'No occupancy information available',
				},
			],
			parallelZuege: [],
		},
		{
			administrationId: 'OWRE__',
			risZuglaufId: 'RE_73737',
			risAbfahrtId: '8011155_2025-03-06T14:54:00+01:00',
			kurztext: 'RE',
			mitteltext: 'RE 1',
			langtext: 'RE 1 (73737)',
			zuglaufId: '2|#VN#1#ST#1741032079#PI#0#ZI#542863#TA#2#DA#60325#1S#8010113#1T#1355#LS#8010224#LT#1647#PU#80#RT#1#CA#DPN#ZE#73737#ZB#RE 73737#PC#3#FR#8010113#FT#1355#TO#8010224#TT#1647#',
			reservierungsMeldungen: [],
			nummer: 1,
			abschnittsDauer: 300,
			typ: 'FAHRZEUG',
			halte: [
				{
					abgangsDatum: '2025-03-06T14:54:00+01:00',
					ezAbgangsDatum: '2025-03-06T14:55:00+01:00',
					ort: {
						name: 'Berlin Alexanderplatz',
						locationId: 'A=1@O=Berlin Alexanderplatz@X=13410962@Y=52521481@U=80@L=8011155@i=U×008003135@',
						evaNr: '8011155',
						position: {
							latitude: 52.521526,
							longitude: 13.411088,
						},
						stationId: '0053',
					},
					gleis: '2',
					attributNotizen: [],
					echtzeitNotizen: [],
					himNotizen: [],
					auslastungsInfos: [
						{
							klasse: 'KLASSE_1',
							stufe: 0,
							anzeigeTextKurz: 'No occupancy information available',
						},
						{
							klasse: 'KLASSE_2',
							stufe: 0,
							anzeigeTextKurz: 'No occupancy information available',
						},
					],
				},
				{
					ankunftsDatum: '2025-03-06T14:56:00+01:00',
					abgangsDatum: '2025-03-06T14:57:00+01:00',
					ezAbgangsDatum: '2025-03-06T14:58:00+01:00',
					ezAnkunftsDatum: '2025-03-06T14:57:00+01:00',
					ort: {
						name: 'Berlin Friedrichstraße',
						locationId: 'A=1@O=Berlin Friedrichstraße@X=13387203@Y=52520376@U=80@L=8011306@i=U×008003137@',
						evaNr: '8011306',
						position: {
							latitude: 52.520332,
							longitude: 13.386925,
						},
						stationId: '0527',
					},
					gleis: '4',
					attributNotizen: [],
					echtzeitNotizen: [],
					himNotizen: [],
					auslastungsInfos: [
						{
							klasse: 'KLASSE_1',
							stufe: 0,
							anzeigeTextKurz: 'No occupancy information available',
						},
						{
							klasse: 'KLASSE_2',
							stufe: 0,
							anzeigeTextKurz: 'No occupancy information available',
						},
					],
				},
				{
					ankunftsDatum: '2025-03-06T14:59:00+01:00',
					ezAnkunftsDatum: '2025-03-06T15:00:00+01:00',
					ort: {
						name: 'Berlin Hbf',
						locationId: 'A=1@O=Berlin Hbf@X=13369549@Y=52525589@U=80@L=8011160@i=U×008065969@',
						evaNr: '8011160',
						position: {
							latitude: 52.524925,
							longitude: 13.369629,
						},
						stationId: '1071',
					},
					gleis: '14',
					attributNotizen: [],
					echtzeitNotizen: [],
					himNotizen: [],
					auslastungsInfos: [
						{
							klasse: 'KLASSE_1',
							stufe: 0,
							anzeigeTextKurz: 'No occupancy information available',
						},
						{
							klasse: 'KLASSE_2',
							stufe: 0,
							anzeigeTextKurz: 'No occupancy information available',
						},
					],
				},
			],
			himNotizen: [],
			echtzeitNotizen: [],
			attributNotizen: [
				{
					text: 'Number of bicycles conveyed limited',
					key: 'FB',
					priority: 260,
				},
				{
					text: 'Conveyance of groups is limited',
					key: 'GL',
					priority: 330,
				},
				{
					text: 'space for wheelchairs',
					key: 'RO',
					priority: 560,
				},
				{
					text: 'vehicle-mounted access aid',
					key: 'EH',
					priority: 560,
				},
				{
					text: 'Behindertengerechte Ausstattung',
					key: 'EA',
					priority: 560,
				},
				{
					text: 'power sockets for laptop',
					key: 'LS',
					priority: 605,
				},
				{
					text: 'air conditioning',
					key: 'KL',
					priority: 610,
				},
				{
					text: 'Wifi available',
					key: 'WV',
					priority: 710,
				},
				{
					text: 'Ostdeutsche Eisenbahn GmbH',
					key: 'OP',
				},
			],
			abgangsOrt: {
				name: 'Berlin Alexanderplatz',
				locationId: 'A=1@O=Berlin Alexanderplatz@X=13410962@Y=52521481@U=80@L=8011155@i=U×008003135@',
				evaNr: '8011155',
				position: {
					latitude: 52.521526,
					longitude: 13.411088,
				},
				stationId: '0053',
			},
			abgangsDatum: '2025-03-06T14:54:00+01:00',
			ezAbgangsDatum: '2025-03-06T14:55:00+01:00',
			ankunftsOrt: {
				name: 'Berlin Hbf',
				locationId: 'A=1@O=Berlin Hbf@X=13369549@Y=52525589@U=80@L=8011160@i=U×008065969@',
				evaNr: '8011160',
				position: {
					latitude: 52.524925,
					longitude: 13.369629,
				},
				stationId: '1071',
			},
			ankunftsDatum: '2025-03-06T14:59:00+01:00',
			ezAnkunftsDatum: '2025-03-06T15:00:00+01:00',
			verkehrsmittelNummer: '73737',
			richtung: 'Magdeburg Hbf',
			produktGattung: 'RB',
			wagenreihung: false,
			auslastungsInfos: [
				{
					klasse: 'KLASSE_1',
					stufe: 0,
					anzeigeTextKurz: 'No occupancy information available',
				},
				{
					klasse: 'KLASSE_2',
					stufe: 0,
					anzeigeTextKurz: 'No occupancy information available',
				},
			],
			parallelZuege: [],
			polylineGroup: {
				polylineDesc: [
					{
						coordinates: [
							{
								longitude: 13.411088,
								latitude: 52.521526,
							},
							{
								longitude: 13.411088,
								latitude: 52.521526,
							},
						],
						delta: false,
					},
					{
						coordinates: [
							{
								longitude: 13.411088,
								latitude: 52.521526,
							},
							{
								longitude: 13.409676,
								latitude: 52.522344,
							},
							{
								longitude: 13.408202,
								latitude: 52.522964,
							},
							{
								longitude: 13.407177,
								latitude: 52.523243,
							},
							{
								longitude: 13.406377,
								latitude: 52.523324,
							},
							{
								longitude: 13.40502,
								latitude: 52.523252,
							},
							{
								longitude: 13.402233,
								latitude: 52.522533,
							},
							{
								longitude: 13.402233,
								latitude: 52.522533,
							},
							{
								longitude: 13.401191,
								latitude: 52.52238,
							},
							{
								longitude: 13.398629,
								latitude: 52.522281,
							},
							{
								longitude: 13.397613,
								latitude: 52.522137,
							},
							{
								longitude: 13.396669,
								latitude: 52.52185,
							},
							{
								longitude: 13.394125,
								latitude: 52.520618,
							},
							{
								longitude: 13.392831,
								latitude: 52.520259,
							},
							{
								longitude: 13.389451,
								latitude: 52.520025,
							},
							{
								longitude: 13.388309,
								latitude: 52.520088,
							},
							{
								longitude: 13.386925,
								latitude: 52.520331,
							},
							{
								longitude: 13.38634,
								latitude: 52.520564,
							},
							{
								longitude: 13.386322,
								latitude: 52.520555,
							},
							{
								longitude: 13.386376,
								latitude: 52.520636,
							},
							{
								longitude: 13.382844,
								latitude: 52.521391,
							},
							{
								longitude: 13.380129,
								latitude: 52.521436,
							},
							{
								longitude: 13.378906,
								latitude: 52.521679,
							},
							{
								longitude: 13.377576,
								latitude: 52.522308,
							},
							{
								longitude: 13.375598,
								latitude: 52.52416,
							},
							{
								longitude: 13.37452,
								latitude: 52.524744,
							},
							{
								longitude: 13.373126,
								latitude: 52.525158,
							},
							{
								longitude: 13.372398,
								latitude: 52.525257,
							},
							{
								longitude: 13.370043,
								latitude: 52.525239,
							},
							{
								longitude: 13.370043,
								latitude: 52.525239,
							},
							{
								longitude: 13.369567,
								latitude: 52.525203,
							},
						],
						delta: false,
					},
					{
						coordinates: [
							{
								longitude: 13.369567,
								latitude: 52.525203,
							},
							{
								longitude: 13.369629,
								latitude: 52.524924,
							},
						],
						delta: false,
					},
				],
			},
		},
	],
}

tap.test('dbnav profile fixes time zone bug', async (t) => { // see https://github.com/public-transport/db-vendo-client/issues/24
	const parsedJourney = await parseJourneyDbnav(ctx, structuredClone(input));
	const expectedDeparture = '2025-03-06T14:52:00+01:00';
	t.equal(parsedJourney.legs[0].departure, expectedDeparture)

	const expectedArrival = '2025-03-06T14:52:00+01:00';
	t.equal(parsedJourney.legs[0].arrival, expectedArrival)

	const expectedDelay = 0;
	t.equal(parsedJourney.legs[0].departureDelay, expectedDelay)
	t.equal(parsedJourney.legs[0].arrivalDelay, expectedDelay)

	t.end();
})

tap.test('dbnav profile parses journey without time zone bug like other profiles', async (t) => {
	const _input = structuredClone(input);
	// fix bug by hand
	_input.verbindungsAbschnitte[0].ezAbgangsDatum = '2025-03-06T14:52:00+01:00';
	_input.verbindungsAbschnitte[0].ezAnkunftsDatum = '2025-03-06T14:54:00+01:00';
	const expected = await parseJourneyDefault(ctx, _input)

	t.same(await parseJourneyDbnav(ctx, _input), expected);

	t.end();
})
