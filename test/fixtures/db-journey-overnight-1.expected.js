const büchen = {
	type: 'stop',
	id: '8000058',
	name: 'Büchen',
	location: {
		type: 'location',
		id: '8000058',
		latitude: 53.475291,
		longitude: 10.622939,
	},
	products: {
		nationalExpress: true,
		national: true,
		regionalExpress: false,
		regional: true,
		suburban: false,
		bus: true,
		ferry: false,
		subway: false,
		tram: false,
		taxi: true,
	},
};

const berlinHbfTief = {
	type: 'stop',
	id: '8098160',
	name: 'Berlin Hbf (tief)',
	location: {
		type: 'location',
		id: '8098160',
		latitude: 52.52585,
		longitude: 13.368892,
	},
	products: {
		nationalExpress: true,
		national: true,
		regionalExpress: true,
		regional: true,
		suburban: true,
		bus: true,
		ferry: false,
		subway: true,
		tram: true,
		taxi: false,
	},
	station: {
		type: 'station',
		id: '8011160',
		name: 'Berlin Hbf',
		location: {
			type: 'location',
			id: '8011160',
			latitude: 52.524924,
			longitude: 13.369629,
		},
		products: {
			nationalExpress: true,
			national: true,
			regionalExpress: true,
			regional: true,
			suburban: true,
			bus: true,
			ferry: false,
			subway: true,
			tram: true,
			taxi: false,
		},
	},
};

const overnightJourney = {
	type: 'journey',
	refreshToken: 'T$A=1@O=Lübeck Hbf@L=8000237@a=128@$A=1@O=Büchen@L=8000058@a=128@$202311242210$202311242249$erx21137$$1$$$$$$§T$A=1@O=Büchen@L=8000058@a=128@$A=1@O=Berlin Hbf (tief)@L=8098160@a=128@$202311242315$202311250054$ICE  907$$1$$$$$$§T$A=1@O=Berlin Hbf (tief)@L=8098160@a=128@$A=1@O=München Hbf@L=8000261@a=128@$202311250430$202311250917$ICE  501$$1$$$$$$',

	legs: [
		{
			origin: {
				type: 'stop',
				id: '8000237',
				name: 'Lübeck Hbf',
				location: {
					type: 'location',
					id: '8000237',
					latitude: 53.86767,
					longitude: 10.669737,
				},
				products: {
					nationalExpress: true,
					national: true,
					regionalExpress: true,
					regional: true,
					suburban: false,
					bus: true,
					ferry: false,
					subway: false,
					tram: false,
					taxi: true,
				},
			},
			destination: büchen,
			departure: '2023-11-24T22:10:00+01:00',
			plannedDeparture: '2023-11-24T22:10:00+01:00',
			departureDelay: null,
			arrival: '2023-11-24T22:49:00+01:00',
			plannedArrival: '2023-11-24T22:49:00+01:00',
			arrivalDelay: null,
			reachable: true,
			tripId: '1|466091|0|80|24112023',
			line: {
				type: 'line',
				id: 'erx-re83',
				fahrtNr: '21137',
				name: 'erx RE83',
				public: true,
				adminCode: 'X1____',
				productName: 'erx',
				mode: 'train',
				product: 'regional',
				operator: {
					type: 'operator',
					id: 'erixx',
					name: 'erixx',
				},
				additionalName: 'erx RE83',
			},
			direction: 'Lüneburg',
			arrivalPlatform: '140',
			plannedArrivalPlatform: '140',
			arrivalPrognosisType: null,
			departurePlatform: '6',
			plannedDeparturePlatform: '6',
			departurePrognosisType: 'prognosed',
			remarks: [
				{
					text: 'Number of bicycles conveyed limited',
					type: 'hint',
					code: 'bicycle-conveyance',
					summary: 'bicycles conveyed',
				},
				{
					text: 'space for wheelchairs',
					type: 'hint',
					code: 'wheelchairs-space',
					summary: 'space for wheelchairs',
				},
				{
					text: 'vehicle-mounted access aid',
					type: 'hint',
					code: 'boarding-ramp',
					summary: 'vehicle-mounted boarding ramp available',
				},
				{
					type: 'hint',
					code: 'SI',
					text: 'Barrierefreier Zustieg an geeigneten Stationen möglich',
				},
				{
					type: 'hint',
					code: 'SM',
					text: 'Info www.bahn.de/sh-barrierefrei',
				},
			],
		},
		{
			origin: büchen,
			destination: berlinHbfTief,
			departure: '2023-11-24T23:15:00+01:00',
			plannedDeparture: '2023-11-24T23:15:00+01:00',
			departureDelay: null,
			arrival: '2023-11-25T00:54:00+01:00',
			plannedArrival: '2023-11-25T00:54:00+01:00',
			arrivalDelay: null,
			reachable: true,
			tripId: '1|206310|0|80|24112023',
			line: {
				type: 'line',
				id: 'ice-907',
				fahrtNr: '907',
				name: 'ICE 907',
				public: true,
				adminCode: '80____',
				productName: 'ICE',
				mode: 'train',
				product: 'nationalExpress',
				operator: {
					type: 'operator',
					id: 'db-fernverkehr-ag',
					name: 'DB Fernverkehr AG',
				},
			},
			direction: 'Berlin Südkreuz',
			arrivalPlatform: '1',
			plannedArrivalPlatform: '1',
			arrivalPrognosisType: null,
			departurePlatform: '1',
			plannedDeparturePlatform: '1',
			departurePrognosisType: null,
			remarks: [
				{
					text: 'Komfort Check-in possible (visit bahn.de/kci for more information)',
					type: 'hint',
					code: 'komfort-checkin',
					summary: 'Komfort-Checkin available',
				},
				{
					text: 'Bordrestaurant',
					type: 'hint',
					code: 'on-board-restaurant',
					summary: 'Bordrestaurant available',
				},
			],
			loadFactor: 'low-to-medium',
		},
		{
			origin: berlinHbfTief,
			destination: {
				type: 'stop',
				id: '8000261',
				name: 'München Hbf',
				location: {
					type: 'location',
					id: '8000261',
					latitude: 48.140364,
					longitude: 11.558744,
				},
				products: {
					nationalExpress: true,
					national: true,
					regionalExpress: true,
					regional: true,
					suburban: true,
					bus: true,
					ferry: false,
					subway: true,
					tram: true,
					taxi: false,
				},
			},
			departure: '2023-11-25T04:30:00+01:00',
			plannedDeparture: '2023-11-25T04:30:00+01:00',
			departureDelay: null,
			arrival: '2023-11-25T09:17:00+01:00',
			plannedArrival: '2023-11-25T09:17:00+01:00',
			arrivalDelay: null,
			reachable: true,
			tripId: '1|198958|0|80|25112023',
			line: {
				type: 'line',
				id: 'ice-501',
				fahrtNr: '501',
				name: 'ICE 501',
				public: true,
				adminCode: '80____',
				productName: 'ICE',
				mode: 'train',
				product: 'nationalExpress',
				operator: {
					type: 'operator',
					id: 'db-fernverkehr-ag',
					name: 'DB Fernverkehr AG',
				},
			},
			direction: 'München Hbf',
			arrivalPlatform: '19',
			plannedArrivalPlatform: '19',
			arrivalPrognosisType: 'prognosed',
			departurePlatform: '1',
			plannedDeparturePlatform: '1',
			departurePrognosisType: null,
			remarks: [
				{
					text: 'Komfort Check-in possible (visit bahn.de/kci for more information)',
					type: 'hint',
					code: 'komfort-checkin',
					summary: 'Komfort-Checkin available',
				},
				{
					text: 'Bicycles conveyed - subject to reservation',
					type: 'hint',
					code: 'bicycle-conveyance-reservation',
					summary: 'bicycles conveyed, subject to reservation',
				},
				{
					text: 'Number of bicycles conveyed limited',
					type: 'hint',
					code: 'bicycle-conveyance',
					summary: 'bicycles conveyed',
				},
				{
					text: 'Bordrestaurant',
					type: 'hint',
					code: 'on-board-restaurant',
					summary: 'Bordrestaurant available',
				},
				{
					text: 'vehicle-mounted access aid',
					type: 'hint',
					code: 'boarding-ramp',
					summary: 'vehicle-mounted boarding ramp available',
				},
			],
			loadFactor: 'low-to-medium',
		},
	],

	remarks: [],
	price: {amount: 108.9, currency: 'EUR', hint: null},
};

export {
	overnightJourney,
};
