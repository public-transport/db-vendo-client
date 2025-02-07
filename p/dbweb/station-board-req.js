const formatStationBoardReq = (ctx, station, type) => {
	const {profile, opt} = ctx;

	const maxVias = opt.vias ?? 0;

	return {
		endpoint: profile.boardEndpoint,
		path: type === 'departures' ? 'abfahrten' : 'ankuenfte',
		query: {
			ortExtId: station,
			zeit: profile.formatTimeOfDay(profile, opt.when),
			datum: profile.formatDate(profile, opt.when),
			mitVias: maxVias !== 0 ? true : undefined,
			maxVias: maxVias === -1 ? undefined : maxVias,
			verkehrsmittel: profile.formatProductsFilter(ctx, opt.products || {}),
		},
		method: 'GET',
	};
};

export {
	formatStationBoardReq,
};
