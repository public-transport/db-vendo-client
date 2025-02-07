import {formatTripReq as hafasFormatTripReq} from '../dbnav/trip-req.js';
import {formatTripReq as risTripReq} from '../dbregioguide/trip-req.js';


const formatTripReq = ({profile, opt}, id) => {
	const _profile = {...profile};
	if (id.includes('#')) {
		_profile['tripEndpoint'] = profile.tripEndpoint_dbnav;
		return hafasFormatTripReq({profile: _profile, opt}, id);
	}

	_profile['tripEndpoint'] = profile.tripEndpoint_dbregioguide;
	return risTripReq({profile: _profile, opt}, id);
};

export {
	formatTripReq,
};
