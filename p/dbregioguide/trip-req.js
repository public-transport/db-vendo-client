const formatTripReq = ({profile, opt}, id) => {
	return {
		endpoint: profile.tripEndpoint,
		path: id,
		method: 'get',
	};
};

export {
	formatTripReq,
};
