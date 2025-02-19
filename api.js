import {createClient} from './index.js';
import {profile as dbProfile} from './p/db/index.js';
import {profile as dbnavProfile} from './p/dbnav/index.js';
import {profile as dbwebProfile} from './p/dbweb/index.js';
import {mapRouteParsers} from './lib/api-parsers.js';
import {createHafasRestApi as createApi} from 'hafas-rest-api';

const config = {
	hostname: process.env.HOSTNAME || 'localhost',
	port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
	name: 'db-vendo-client',
	description: 'db-vendo-client',
	homepage: 'https://github.com/public-transport/db-vendo-client',
	version: '6',
	docsLink: 'https://github.com/public-transport/db-vendo-client',
	openapiSpec: true,
	logging: true,
	aboutPage: true,
	enrichStations: true,
	etags: 'strong',
	csp: 'default-src \'none\'; style-src \'self\' \'unsafe-inline\'; img-src https:',
	mapRouteParsers,
};

const profiles = {
	db: dbProfile,
	dbnav: dbnavProfile,
	dbweb: dbwebProfile,
};

const start = async () => {
	const vendo = createClient(
		profiles[process.env.DB_PROFILE] || dbnavProfile,
		process.env.USER_AGENT || 'link-to-your-project-or-email',
		config,
	);
	const api = await createApi(vendo, config);

	api.listen(config.port, (err) => {
		if (err) {
			console.error(err);
		}
	});
};

start();
