const formatJourneysReq = (ctx, from, to, when, outFrwd, journeysRef) => {
	const {profile, opt} = ctx;

	from = profile.formatLocation(profile, from, 'from');
	to = profile.formatLocation(profile, to, 'to');
	const filters = profile.formatProductsFilter({profile}, opt.products || {});
	// TODO opt.accessibility
	// TODO routingMode
	let query = {
		maxUmstiege: opt.transfers === -1 ? undefined : opt.transfers, // setting `maxUmstiege` to -1 is not allowed, see https://github.com/public-transport/db-vendo-client/issues/5
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
	const {profile} = ctx;
	let query = {
		ctxRecon: refreshToken,
		deutschlandTicketVorhanden: false,
		nurDeutschlandTicketVerbindungen: false,
		reservierungsKontingenteVorhanden: false,
	};
	query = Object.assign(query, profile.formatTravellers(ctx));
	return {
		endpoint: profile.refreshJourneysEndpoint,
		body: query,
		method: 'post',
	};
};

export {
	formatJourneysReq,
	formatRefreshJourneyReq,
};
