import {createRequire} from 'module';
const require = createRequire(import.meta.url);

import {createClient} from '../index.js';
import {profile as rawProfile} from '../p/db/index.js';
const dynamicProfileData = require('../p/db/dynamicProfileData.json');
const dbnavBase = require('../p/dbnav/base.json');
const dbwebBase = require('../p/dbweb/base.json');
const dbregioguideBase = require('../p/dbregioguide/base.json');

import tap from 'tap';

const client = createClient(rawProfile, 'public-transport/hafas-client:test');

tap.test('db: determine base urls', (t) => {
	const fqdns = {
		dbnav: 'app.vendo.noncd.db.de',
		dbregioguide: 'regio-guide.de',
		dbweb: 'int.bahn.de',
	};

	for (const {profileName, baseKeys} of Object.values(dynamicProfileData)) {
		if (profileName !== 'db') { // endpoint(s) is(/are) static. Check if correct fqdn is contained in base(s)
			for (const baseKey of baseKeys) {
				t.ok(client.profile[baseKey].includes(fqdns[profileName]), [`base url for ${profileName} profile should include ${fqdns[profileName]}`]);
			}
			continue;
		}

		// endpoint(s) is(/are) dynamic. Check if actual base key does not exist yet. Also check, if bases for all profiles are properly stored in other aux entries for later use
		for (const baseKey of baseKeys) {
			for (const [profileName, fqdn] of Object.entries(fqdns)) {
				t.notHas(client.profile, baseKey, [`db profile should not contain the key ${baseKey}, since it is dynamically dispatched at runtime`]);
				t.ok(client.profile[`${baseKey}_${profileName}`].includes(fqdn), [`key ${baseKey}_${profileName} of db profile should include ${fqdns[profileName]}`]);
			}
		}
	}
	t.end();
});

tap.test('db: dynamic client method', async (t) => {
	t.equal(dynamicProfileData.trip.profileName, 'db', ['if this fails, check a different client method in this test']);

	t.equal(client.profile.formatTripReq, (await import('../p/db/trip-req.js')).formatTripReq);
	t.notHas(client.profile, 'tripEndpoint');
	t.equal(client.profile.tripEndpoint_dbnav, dbnavBase.tripEndpoint);
	t.equal(client.profile.tripEndpoint_dbweb, dbwebBase.tripEndpoint);
	t.equal(client.profile.tripEndpoint_dbregioguide, dbregioguideBase.tripEndpoint);

	t.end();
});

tap.test('db: static client method', async (t) => {
	t.equal(dynamicProfileData.nearby.profileName, 'dbnav', ['if this fails, check a different client method in this test']);

	t.equal(client.profile.formatNearbyReq, (await import('../p/dbnav/nearby-req.js')).formatNearbyReq);
	t.equal(client.profile.nearbyEndpoint, dbnavBase.nearbyEndpoint);

	t.end();
});
