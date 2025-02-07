import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const dynamicProfileData = require('./dynamicProfileData.json');
const dbnavBase = require('../dbnav/base.json');
const dbregioguideBase = require('../dbregioguide/base.json');
const dbwebBase = require('../dbweb/base.json');
import {products} from '../../lib/products.js';

const profile = {
	locale: 'de-DE',
	timezone: 'Europe/Berlin',

	products,
};

// add profile methods
for (const {profileName, profileMethods} of Object.values(dynamicProfileData)) {
	for (const {methodName, moduleName} of profileMethods) {
		try {
			// TODO use `import()` with top-level await once updated to es2022
			profile[methodName] = require(`../${profileName}/${moduleName}`)[methodName];
		} catch { /* use implementation from default profile if module doesn't exist */ }
	}
}

const bases = {
	dbnav: dbnavBase,
	dbregioguide: dbregioguideBase,
	dbweb: dbwebBase,
};

// add endpoint bases
for (const {profileName, baseKeys} of Object.values(dynamicProfileData)) {
	if (profileName !== 'db') { // only add endpoint(s) from specified profile
		for (const baseKey of baseKeys) {
			profile[baseKey] = bases[profileName][baseKey];
		}
		continue;
	}

	// add endpoints from all profiles with the profile names as key suffixes and dynamically decide which to use later
	for (const [profileName, profileBases] of Object.entries(bases)) {
		for (const baseKey of baseKeys) {
			profile[`${baseKey}_${profileName}`] = profileBases[baseKey];
		}
	}
}

export {
	profile,
};
