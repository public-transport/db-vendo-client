import {getHeaders} from './header.js';

const formatBaseJourneysReq = (ctx) => {
	// TODO opt.accessibility
	// TODO routingMode
	const travellers = ctx.profile.formatTravellers(ctx);
	const baseReq = {
		autonomeReservierung: false,
		einstiegsTypList: [
			'STANDARD',
		],
		fahrverguenstigungen: {
			deutschlandTicketVorhanden: ctx.opt.deutschlandTicketDiscount,
			nurDeutschlandTicketVerbindungen: ctx.opt.deutschlandTicketConnectionsOnly,
		},
		klasse: travellers.klasse,
		reisendenProfil: {
			reisende: travellers.reisende.map(t => {
				return {
					ermaessigungen: [
						t.ermaessigungen[0].art + ' ' + t.ermaessigungen[0].klasse,
					],
					reisendenTyp: t.typ,
					alter: t.alter.length && parseInt(t.alter[0]) || undefined,
				};
			}),
		},
		reservierungsKontingenteVorhanden: false,
	};

	// Add business customer affiliation if BMIS number is provided
	if (ctx.opt.bmisNumber) {
		baseReq.firmenZugehoerigkeit = {
			bmisNr: ctx.opt.bmisNumber,
			identifikationsart: 'BMIS',
		};
	}

	return baseReq;
};

const formatJourneysReq = (ctx, from, to, when, outFrwd, journeysRef) => {
	const {profile, opt} = ctx;

	from = profile.formatLocation(profile, from, 'from');
	to = profile.formatLocation(profile, to, 'to');
	const filters = profile.formatProductsFilter({profile}, opt.products || {}, 'dbnav');
	const transfers = profile.formatTransfers(opt.transfers) ?? undefined; // `dbnav` does not allow `null` here
	// TODO opt.accessibility
	// TODO routingMode
	let query = formatBaseJourneysReq(ctx);
	query.reiseHin = {
		wunsch: {
			abgangsLocationId: from.lid,
			verkehrsmittel: filters,
			zeitWunsch: {
				reiseDatum: profile.formatTime(profile, when, true),
				zeitPunktArt: outFrwd ? 'ABFAHRT' : 'ANKUNFT',
			},
			viaLocations: opt.via
				? [{locationId: profile.formatLocation(profile, opt.via, 'opt.via').lid}]
				: undefined,
			zielLocationId: to.lid,
			maxUmstiege: transfers,
			minUmstiegsdauer: opt.transferTime || undefined,
			fahrradmitnahme: opt.bike,
		},
	};
	if (journeysRef) {
		query.reiseHin.wunsch.context = journeysRef;
	}
	if (opt.notOnlyFastRoutes) {
		query.reiseHin.wunsch.economic = true;
	}
	return {
		endpoint: opt.bestprice ? profile.bestpriceEndpoint : profile.journeysEndpoint,
		body: query,
		headers: getHeaders('application/x.db.vendo.mob.verbindungssuche.v8+json'),
		method: 'post',
	};
};

const formatRefreshJourneyReq = (ctx, refreshToken) => {
	const {profile, opt} = ctx;
	let query = {
		reconCtx: refreshToken,
	};
	if (opt.tickets) {
		query = formatBaseJourneysReq(ctx);
		query.verbindungHin = {kontext: refreshToken};
	}
	return {
		endpoint: opt.tickets ? profile.refreshJourneysEndpointTickets : profile.refreshJourneysEndpointPolyline,
		body: query,
		headers: getHeaders('application/x.db.vendo.mob.verbindungssuche.v8+json'),
		method: 'post',
	};
};

export {
	formatJourneysReq,
	formatRefreshJourneyReq,
};
