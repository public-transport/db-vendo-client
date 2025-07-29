import {getHeaders} from '../p/dbnav/header.js';

// Helper to fetch Verbundticket prices via recon API
const fetchVerbundticketPrices = async (ctx, userAgent, journey) => {
	const {profile, opt} = ctx;

	// Verbundtickets require a kontext token to fetch prices
	const kontext = journey.kontext || journey.ctxRecon;
	if (!kontext) {
		return null;
	}

	// Extract journey details
	const firstLeg = journey.verbindungsAbschnitte?.[0];
	const lastLeg = journey.verbindungsAbschnitte?.[journey.verbindungsAbschnitte.length - 1];
	const abgangsOrt = firstLeg?.abgangsOrt;
	const ankunftsOrt = lastLeg?.ankunftsOrt;
	const abgangsDatum = firstLeg?.abgangsDatum;

	// Build recon request exactly matching DB Navigator mobile API format
	const reconRequest = {
		endpoint: profile.refreshJourneysEndpointTickets || 'https://app.vendo.noncd.db.de/mob/angebote/recon',
		method: 'post',
		headers: getHeaders('application/x.db.vendo.mob.verbindungssuche.v9+json'),
		body: {
			fahrverguenstigungen: {
				nurDeutschlandTicketVerbindungen: ctx.opt.deutschlandTicketConnectionsOnly || false,
				deutschlandTicketVorhanden: ctx.opt.deutschlandTicketDiscount || false,
			},
			reservierungsKontingenteVorhanden: false,
			suchParameter: {
				reisewunschHin: {
					economic: false,
					abgangsLocationId: abgangsOrt?.locationId || extractLocationFromKontext(kontext, 'from'),
					viaLocations: [],
					fahrradmitnahme: false,
					zielLocationId: ankunftsOrt?.locationId || extractLocationFromKontext(kontext, 'to'),
					zeitWunsch: {
						reiseDatum: abgangsDatum || new Date()
							.toISOString(),
						zeitPunktArt: 'ABFAHRT',
					},
					verkehrsmittel: ['ALL'],
				},
			},
			einstiegsTypList: ['STANDARD'],
			klasse: 'KLASSE_2',
			verbindungHin: {
				kontext: kontext,
			},
			reisendenProfil: {
				reisende: [{
					reisendenTyp: 'ERWACHSENER',
					ermaessigungen: ['KEINE_ERMAESSIGUNG KLASSENLOS'],
				}],
			},
		},
	};

	// Add business customer affiliation if BMIS number is provided
	if (ctx.opt.bmisNumber) {
		reconRequest.body.firmenZugehoerigkeit = {
			bmisNr: ctx.opt.bmisNumber,
			identifikationsart: 'BMIS',
		};
	}

	try {
		const {res} = await profile.request(ctx, userAgent, reconRequest);
		return res;
	} catch (err) {
		// Log error but don't fail the entire journey request
		if (opt.debug || profile.DEBUG) {
			console.error('Failed to fetch Verbundticket prices:', err);
		}
		return null;
	}
};

// Helper to extract location from kontext string
const extractLocationFromKontext = (kontext, type) => {
	// Kontext format: "¶HKI¶T$A=1@O=From@...@$A=1@O=To@...@$..."
	const parts = kontext.split('$');
	if (type === 'from' && parts[1]) {
		return parts[1];
	} else if (type === 'to' && parts[2]) {
		return parts[2];
	}
	return null;
};

export {
	fetchVerbundticketPrices,
};
