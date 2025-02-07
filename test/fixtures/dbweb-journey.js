const dbwebJourney = {
	type: 'journey',
	legs: [
		{
			origin: {
				type: 'station',
				id: '8000207',
				name: 'Köln Hbf',
				location: {
					type: 'location',
					id: '8000207',
					latitude: 50.943029,
					longitude: 6.95873,
				},
			},
			destination: {
				type: 'station',
				id: '8003368',
				name: 'Köln Messe/Deutz',
				location: {
					type: 'location',
					id: '8003368',
					latitude: 50.940872,
					longitude: 6.975,
				},
			},
			arrival: '2025-04-11T05:12:00+02:00',
			plannedArrival: '2025-04-11T05:12:00+02:00',
			arrivalDelay: null,
			departure: '2025-04-11T05:11:00+02:00',
			plannedDeparture: '2025-04-11T05:11:00+02:00',
			departureDelay: null,
			direction: 'Hennef(Sieg)',
			arrivalPlatform: '9',
			plannedArrivalPlatform: '9',
			departurePlatform: '10 A-B',
			plannedDeparturePlatform: '10 A-B',
			tripId: '2|#VN#1#ST#1733173731#PI#1#ZI#161473#TA#1#DA#110425#1S#8000208#1T#504#LS#8002753#LT#545#PU#81#RT#1#CA#s#ZE#12#ZB#S     12#PC#4#FR#8000208#FT#504#TO#8002753#TT#545#',
			line: {
				type: 'line',
				id: 's-12',
				fahrtNr: '12',
				name: 'S 12',
				public: true,
				productName: 'S',
				mode: 'train',
				product: 'suburban',
				operator: {
					type: 'operator',
					id: 'db-regio-ag-nrw',
					name: 'DB Regio AG NRW',
				},
			},
			remarks: [
				{
					text: 'Fahrradmitnahme begrenzt möglich',
					type: 'hint',
					code: 'bicycle-conveyance',
					summary: 'bicycles conveyed',
				},
				{
					text: 'nur 2. Klasse',
					type: 'hint',
					code: '2nd-class-only',
					summary: '2. class only',
				},
				{
					text: 'Fahrzeuggebundene Einstiegshilfe vorhanden',
					type: 'hint',
					code: 'boarding-ramp',
					summary: 'vehicle-mounted boarding ramp available',
				},
			],
			polyline: {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [
								6.9597,
								50.943038,
							],
						},
					},
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [
								6.9597,
								50.943038,
							],
						},
					},
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [
								6.960033,
								50.942724,
							],
						},
					},
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [
								6.960491,
								50.942301,
							],
						},
					},
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [
								6.961282,
								50.941825,
							],
						},
					},
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [
								6.962253,
								50.941582,
							],
						},
					},
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [
								6.971467,
								50.941492,
							],
						},
					},
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [
								6.974658,
								50.941285,
							],
						},
					},
				],
			},
		},
		{
			origin: {
				type: 'station',
				id: '8003368',
				name: 'Köln Messe/Deutz',
				location: {
					type: 'location',
					id: '8003368',
					latitude: 50.940872,
					longitude: 6.975,
				},
			},
			destination: {
				type: 'station',
				id: '8073368',
				name: 'Köln Messe/Deutz Gl.11-12',
				location: {
					type: 'location',
					id: '8073368',
					latitude: 50.941717,
					longitude: 6.974065,
				},
			},
			arrival: '2025-04-11T05:19:00+02:00',
			plannedArrival: '2025-04-11T05:19:00+02:00',
			arrivalDelay: null,
			departure: '2025-04-11T05:12:00+02:00',
			plannedDeparture: '2025-04-11T05:12:00+02:00',
			departureDelay: null,
			public: true,
			walking: true,
			distance: 59,
		},
		{
			origin: {
				type: 'station',
				id: '8073368',
				name: 'Köln Messe/Deutz Gl.11-12',
				location: {
					type: 'location',
					id: '8073368',
					latitude: 50.941717,
					longitude: 6.974065,
				},
			},
			destination: {
				type: 'station',
				id: '8000284',
				name: 'Nürnberg Hbf',
				location: {
					type: 'location',
					id: '8000284',
					latitude: 49.445615,
					longitude: 11.082989,
				},
			},
			arrival: '2025-04-11T08:58:00+02:00',
			plannedArrival: '2025-04-11T08:58:00+02:00',
			arrivalDelay: null,
			departure: '2025-04-11T05:20:00+02:00',
			plannedDeparture: '2025-04-11T05:20:00+02:00',
			departureDelay: null,
			tripId: '2|#VN#1#ST#1733173731#PI#1#ZI#155063#TA#0#DA#110425#1S#8000080#1T#358#LS#8000261#LT#1006#PU#81#RT#1#CA#ICE#ZE#523#ZB#ICE  523#PC#0#FR#8000080#FT#358#TO#8000261#TT#1006#',
			line: {
				type: 'line',
				id: 'ice-523',
				fahrtNr: '523',
				name: 'ICE 523',
				public: true,
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
			arrivalPlatform: '9',
			plannedArrivalPlatform: '9',
			departurePlatform: '11',
			plannedDeparturePlatform: '11',
			remarks: [
				{
					text: 'Bordrestaurant',
					type: 'hint',
					code: 'on-board-restaurant',
					summary: 'Bordrestaurant available',
				},
				{
					text: 'Komfort Check-in verfügbar - wenn möglich bitte einchecken',
					type: 'hint',
					code: 'komfort-checkin',
					summary: 'Komfort-Checkin available',
				},
			],
			polyline: {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [
								11.082144,
								49.445678,
							],
						},
					},
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: [
								11.08227,
								49.445435,
							],
						},
					},
				],
			},
		},
	],
	refreshToken: '¶HKI¶T$A=1@O=Köln Hbf@X=6958730@Y=50943029@L=8000207@a=128@$A=1@O=Köln Messe/Deutz@X=6975000@Y=50940872@L=8003368@a=128@$202504110511$202504110512$S     12$$1$$$$$$§W$A=1@O=Köln Messe/Deutz@X=6975000@Y=50940872@L=8003368@a=128@$A=1@O=Köln Messe/Deutz Gl.11-12@X=6974065@Y=50941717@L=8073368@a=128@$202504110512$202504110519$$$1$$$$$$§T$A=1@O=Köln Messe/Deutz Gl.11-12@X=6974065@Y=50941717@L=8073368@a=128@$A=1@O=Nürnberg Hbf@X=11082989@Y=49445615@L=8000284@a=128@$202504110520$202504110858$ICE  523$$1$$$$$$',
	price: {amount: 31.49, currency: 'EUR', hint: null},
	tickets: [{
		name: 'from',
		priceObj: {
			amount: 3149,
			currency: 'EUR',
		},
	}],
	remarks: [],
};

export {
	dbwebJourney,
};
