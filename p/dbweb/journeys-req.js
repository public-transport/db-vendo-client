const formatJourneysReq = (ctx, from, to, when, outFrwd, journeysRef) => {
	const {profile, opt} = ctx;

	from = profile.formatLocation(profile, from, 'from');
	to = profile.formatLocation(profile, to, 'to');
	const filters = profile.formatProductsFilter({profile}, opt.products || {});
	const transfers = profile.formatTransfers(opt.transfers);
	// TODO opt.accessibility
	// TODO routingMode
	let query = {
		maxUmstiege: transfers,
		minUmstiegszeit: opt.transferTime,
		deutschlandTicketVorhanden: false,
		nurDeutschlandTicketVerbindungen: false,
		reservierungsKontingenteVorhanden: false,
		schnelleVerbindungen: true,
		sitzplatzOnly: false,
		abfahrtsHalt: from.lid,
		zwischenhalte: opt.via
			? [{id: profile.formatLocation(profile, opt.via, 'opt.via').lid}]
			: null,
		ankunftsHalt: to.lid,
		produktgattungen: filters,
		bikeCarriage: opt.bike,
		// TODO
		// todo: this is actually "take additional stations nearby the given start and destination station into account"
		// see rest.exe docs
		// ushrp: Boolean(opt.startWithWalking),
	};
	query.anfrageZeitpunkt = profile.formatTime(profile, when);
	if (journeysRef) {
		query.pagingReference = journeysRef;
	}
	query.ankunftSuche = outFrwd ? 'ABFAHRT' : 'ANKUNFT';
	if (opt.results !== null) {
		// TODO query.numF = opt.results;
	}
	query = Object.assign(query, ctx.profile.formatTravellers(ctx));
	return {
		endpoint: ctx.profile.journeysEndpoint,
		body: query,
		method: 'post',
	};
};
// TODO poly conditional other endpoint
const formatRefreshJourneyReq = (ctx, refreshToken) => {
	const {profile, opt} = ctx;
	if (opt.tickets) {
		let query = {
			ctxRecon: refreshToken,
			deutschlandTicketVorhanden: false,
			nurDeutschlandTicketVerbindungen: false,
			reservierungsKontingenteVorhanden: false,
		};
		query = Object.assign(query, profile.formatTravellers(ctx));
		return {
			endpoint: profile.refreshJourneysEndpointTickets,
			body: query,
			method: 'post',
		};
	} else {
		return {
			endpoint: profile.refreshJourneysEndpointPolyline,
			body: {
				ctxRecon: refreshToken,
				poly: true,
			},
			method: 'post',
		};
	}
};

export {
	formatJourneysReq,
	formatRefreshJourneyReq,
};
