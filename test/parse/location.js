import tap from 'tap';
import {parseLocation as parse} from '../../parse/location.js';
import {parseProducts} from '../../parse/products.js';

const profile = {
	parseLocation: parse,
	enrichStation: (ctx, stop) => stop,
	parseStationName: (_, name) => name.toLowerCase(),
	parseProducts,
	products: [{
		id: 'nationalExpress',
		vendo: 'ICE',
	},
	{
		id: 'national',
		vendo: 'IC',
	},
	{
		id: 'regional',
		vendo: 'REGIONAL',
	},
	{
		id: 'bus',
		vendo: 'BUS',
	},
	{
		id: 'taxi',
		vendo: 'ANRUFPFLICHTIG',
	}],
};

const ctx = {
	data: {},
	opt: {
		linesOfStops: false,
		subStops: true,
		entrances: true,
	},
	profile,
};

tap.test('parses an address correctly', (t) => {
	const input = {
		id: 'A=2@O=Würzburg - Heuchelhof, Pergamonweg@X=9952209@Y=49736794@U=92@b=981423354@B=1@p=1706613073@',
		lat: 49.736794,
		lon: 9.952209,
		name: 'Würzburg - Heuchelhof, Pergamonweg',
		products: [],
		type: 'ADR',
	};

	const address = parse(ctx, input);
	t.same(address, {
		type: 'location',
		id: null,
		name: 'Würzburg - Heuchelhof, Pergamonweg',
		address: 'Würzburg - Heuchelhof, Pergamonweg',
		latitude: 49.736794,
		longitude: 9.952209,
	});

	t.end();
});

tap.test('parses a POI correctly', (t) => {
	const input = {
		id: 'A=4@O=Berlin, Pergamonkeller (Gastronomie)@X=13395473@Y=52520223@U=91@L=991526508@B=1@p=1732715706@',
		lat: 52.52022,
		lon: 13.395473,
		name: 'Berlin, Pergamonkeller (Gastronomie)',
		products: [],
		type: 'POI',
	};

	const poi = parse(ctx, input);
	t.same(poi, {
		type: 'location',
		poi: true,
		id: '991526508',
		name: 'Berlin, Pergamonkeller (Gastronomie)',
		latitude: 52.52022,
		longitude: 13.395473,
	});
	t.end();
});

tap.test('parses a stop correctly', (t) => {
	const input = {
		extId: '8012622',
		id: 'A=1@O=Perleberg@X=11852322@Y=53071252@U=81@L=8012622@B=1@p=1733173731@i=U×008027183@',
		lat: 53.07068,
		lon: 11.85039,
		name: 'Perleberg',
		products: [
			'REGIONAL',
			'BUS',
			'ANRUFPFLICHTIG',
		],
		type: 'ST',
	};

	const stop = parse(ctx, input);
	t.same(stop, {
		type: 'station',
		id: '8012622',
		name: 'Perleberg',
		location: {
			type: 'location',
			id: '8012622',
			latitude: 53.07068,
			longitude: 11.85039,
		},
		products: {
			nationalExpress: false,
			national: false,
			regional: true,
			bus: true,
			taxi: true,
		},
	});
	t.end();
});

tap.test('falls back to coordinates from `lid', (t) => {
	const input = {
		id: 'A=1@O=Bahnhof, Rothenburg ob der Tauber@X=10190711@Y=49377180@U=80@L=683407@',
		name: 'Bahnhof, Rothenburg ob der Tauber',
		bahnhofsInfoId: '5393',
		extId: '683407',
		adminID: 'vgn063',
		kategorie: 'Bus',
		nummer: '2524',
	};

	const stop = parse(ctx, input);
	t.same(stop, {
		type: 'station',
		id: '683407',
		name: 'Bahnhof, Rothenburg ob der Tauber',
		location: {
			type: 'location',
			id: '683407',
			latitude: 49.377180,
			longitude: 10.190711,
		},
	});
	t.end();
});
