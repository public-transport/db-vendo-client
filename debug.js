import {createClient} from './index.js';
import {profile} from './p/dbnav/index.js';

const client = createClient(profile, 'hafas-client-debug');

const journeys = await client.journeys('8000105', '8000261', {results: 1});
console.log(journeys);
