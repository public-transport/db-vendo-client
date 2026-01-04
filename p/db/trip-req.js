import {formatTripReq as hafasFormatTripReq} from '../dbnav/trip-req.js';

const formatTripReq = ({profile, opt}, id) => {
	const _profile = {...profile};
	_profile['tripEndpoint'] = profile.tripEndpoint;
	return hafasFormatTripReq({profile: _profile, opt}, id);
};

export {
	formatTripReq,
};
