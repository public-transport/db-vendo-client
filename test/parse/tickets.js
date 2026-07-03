import tap from 'tap';
import {parseTickets} from '../../parse/tickets.js';

const PARTIAL_FARE_HINT = 'Teilpreis / partial fare';
const offer = (name, amount, extra = {}) => ({
	reisePosition: {
		name,
		preis: {betrag: amount, waehrung: 'EUR'},
		typ: 'REISEANGEBOT',
		...extra,
	},
});

tap.test('parses DB mobile API Verbund ticket offers', (t) => {
	const raw = {
		angebote: {
			angebotsCluster: [{
				angebotsSubCluster: [{
					angebotsPositionen: [{
						verbundAngebot: {
							reisePosition: offer('VBB Einzelfahrausweis', 4.70),
						},
					}],
				}],
			}],
		},
	};

	t.strictSame(parseTickets({opt: {tickets: true}}, raw), [{
		name: 'VBB Einzelfahrausweis',
		priceObj: {amount: 470, currency: 'EUR'},
		firstClass: false,
		partialFare: false,
	}]);
	t.end();
});

tap.test('preserves partial-fare metadata without mutating the response', (t) => {
	const position = offer('Verbundtarif', 3.20);
	position.teilpreisInformationen = [{text: 'partial'}];
	const raw = {
		angebote: {
			angebotsCluster: [{
				angebotsSubCluster: [{
					angebotsPositionen: [{
						einfacheFahrt: {standard: {reisePosition: position}},
					}],
				}],
			}],
		},
	};

	const before = structuredClone(raw);
	const [ticket] = parseTickets({opt: {tickets: true}}, raw);
	t.equal(ticket.partialFare, true);
	t.equal(ticket.addData, PARTIAL_FARE_HINT);
	t.strictSame(raw, before);
	t.end();
});
