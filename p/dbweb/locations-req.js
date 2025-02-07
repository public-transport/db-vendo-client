const formatLocationsReq = (ctx, query) => {
	const {profile, opt} = ctx;

	return {
		endpoint: profile.locationsEndpoint,
		query: {
			typ: profile.formatLocationFilter(opt.stops, opt.addresses, opt.poi),
			suchbegriff: query,
			limit: opt.results,
		},
		method: 'get',
	};
};

export {
	formatLocationsReq,
};
