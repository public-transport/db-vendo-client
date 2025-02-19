const formatStationBoardReq = (ctx, station, type) => {
	const {profile, opt} = ctx;

	return {
		endpoint: profile.boardEndpoint,
		path: type === 'departures' ? 'abfahrten' : 'ankuenfte',
		query: {
			ortExtId: station,
			zeit: profile.formatTimeOfDay(profile, opt.when),
			datum: profile.formatDate(profile, opt.when),
			mitVias: opt.stopovers || Boolean(opt.direction) || undefined,
			verkehrsmittel: profile.formatProductsFilter(ctx, opt.products || {}),
		},
		method: 'GET',
	};
};

export {
	formatStationBoardReq,
};
