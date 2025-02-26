const parsePolyline = (ctx, p) => { // p = raw polylineGroup
	const desc = p.polylineDescriptions || p.polylineDesc;
	if (desc.length < 1) {
		return null;
	}
	const points = desc.reduce((max, d) => (d.coordinates.length > max.coordinates.length ? d : max),
	).coordinates; // TODO: initial and final poly?

	if (points.length === 0) {
		return null;
	}

	const res = points.map(ll => ({
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Point',
			coordinates: [ll.lng || ll.longitude, ll.lat || ll.latitude],
		},
	}));

	// TODO initial and final descriptions?, match station info?

	return {
		type: 'FeatureCollection',
		features: res,
	};
};

export {
	parsePolyline,
};
