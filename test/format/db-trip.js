import tap from 'tap';

import {profile as rawProfile} from '../../p/db/index.js';
import {createClient} from '../../index.js';

const client = createClient(rawProfile, 'public-transport/hafas-client:test', {enrichStations: false});
const {profile} = client;

const opt = {
	stopovers: true,
	polyline: false,
	remarks: true,
	language: 'en',
};

const tripIdHafas = '2|#VN#1#ST#1738783727#PI#0#ZI#222242#TA#0#DA#70225#1S#8000237#1T#1317#LS#8000261#LT#2002#PU#80#RT#1#CA#ICE#ZE#1007#ZB#ICE 1007#PC#0#FR#8000237#FT#1317#TO#8000261#TT#2002#';
const tripIdRis = '20250207-e6b2807e-bb48-39f9-89eb-8491ebc4b32c';

const reqDbNavExpected = {
	endpoint: 'https://app.vendo.noncd.db.de/mob/zuglauf/',
	path: '2%7C%23VN%231%23ST%231738783727%23PI%230%23ZI%23222242%23TA%230%23DA%2370225%231S%238000237%231T%231317%23LS%238000261%23LT%232002%23PU%2380%23RT%231%23CA%23ICE%23ZE%231007%23ZB%23ICE%201007%23PC%230%23FR%238000237%23FT%231317%23TO%238000261%23TT%232002%23',
	headers: {
		'Accept': 'application/x.db.vendo.mob.zuglauf.v2+json',
		'Content-Type': 'application/x.db.vendo.mob.zuglauf.v2+json',
	},
	method: 'get',
};

const reqDbRegioGuideExpected = {
	endpoint: 'https://regio-guide.de/@prd/zupo-travel-information/api/public/ri/journey/',
	path: '20250207-e6b2807e-bb48-39f9-89eb-8491ebc4b32c',
	method: 'get',
};

tap.test('db trip(): dynamic request formatting', (t) => {
	const ctx = {profile, opt};
	t.notHas(client.profile, 'tripEndpoint');

	const reqDbNav = profile.formatTripReq(ctx, tripIdHafas);
	delete reqDbNav.headers['X-Correlation-ID'];
	const reqDbRegioGuide = profile.formatTripReq(ctx, tripIdRis);

	t.same(reqDbNav, reqDbNavExpected);
	t.same(reqDbRegioGuide, reqDbRegioGuideExpected);

	t.end();
});
