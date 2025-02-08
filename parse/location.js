import {parse} from 'qs';

const POI = 'POI';
const STATION = 'ST';
const ADDRESS = 'ADR';

const leadingZeros = /^0+/;

const parseLocation = (ctx, l) => {
	const {profile, common} = ctx;

	if (!l) {
		return null;
	}

	const lid = parse(l.id || l.locationId, {delimiter: '@'});
	const res = {
		type: 'location',
		id: (l.extId || l.evaNr || lid.L || l.evaNumber || l.evaNo || l.bahnhofsId || '').replace(leadingZeros, '') || null,
	};
	const name = l.name || lid.O;

	if (l.lat && l.lon || l.coordinates || l.position) {
		res.latitude = l.lat || l.coordinates?.latitude || l.position?.latitude;
		res.longitude = l.lon || l.coordinates?.longitude || l.position?.longitude;
	} else if ('X' in lid && 'Y' in lid) {
		res.latitude = lid.Y / 1000000;
		res.longitude = lid.X / 1000000;
	}

	// addresses and pois might also have fake evaNr sometimes!
	if (l.type === STATION || l.extId || l.evaNumber || l.evaNo || lid.A == '1' || l.bahnhofsId) {
		let stop = {
			type: 'station',
			id: res.id,
		};
		if (name) {
			stop.name = name;
		}
		if ('number' === typeof res.latitude) {
			stop.location = res; // todo: remove `.id`
		}
		// TODO subStops

		if ('products' in l) {
			stop.products = profile.parseProducts(ctx, l.products);
		}

		if (common && common.locations && common.locations[stop.id]) {
			delete stop.type;
			stop = {
				...common.locations[stop.id],
				...stop,
			};
		}

		// TODO isMeta
		// TODO entrances, lines
		return stop;
	}

	if (name && common?.locations?.[name] && res.id === null) {
		delete res.type;
		delete res.id;

		return {
			...common.locations[name],
			...res,
		};
	}

	res.name = name;
	if (l.type === ADDRESS || lid.A == '2') {
		res.address = name;
	}
	if (l.type === POI || lid.A == '4') {
		res.poi = true;
	}

	return res;
};

export {
	parseLocation,
};
