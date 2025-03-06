import {parseJourney as parseJourneyDefault} from '../../parse/journey.js';

const parseJourney = (ctx, jj) => {
	const legs = (jj.verbindung || jj).verbindungsAbschnitte;
	if (legs.length > 0) {
		legs[0] = preprocessJourneyLeg(legs[0]);
	}
	if (legs.length > 1) {
		legs[legs.length - 1] = preprocessJourneyLeg(legs.at(-1));
	}

	return parseJourneyDefault(ctx, jj);
};

const preprocessJourneyLeg = (pt) => { // fixes https://github.com/public-transport/db-vendo-client/issues/24
	if (pt.typ === 'FUSSWEG' || pt.typ === 'TRANSFER') {
		pt.ezAbgangsDatum = correctRealtimeTimeZone(pt.abgangsDatum, pt.ezAbgangsDatum);
		pt.ezAnkunftsDatum = correctRealtimeTimeZone(pt.ankunftsDatum, pt.ezAnkunftsDatum);
	}

	return pt;
};

const correctRealtimeTimeZone = (planned, realtime) => {
	if (planned && realtime) {
		const timeZoneOffsetRegex = /([+-]\d\d:\d\d|Z)$/;
		const timeZoneOffsetPlanned = timeZoneOffsetRegex.exec(planned)[0];
		return realtime.replace(timeZoneOffsetRegex, timeZoneOffsetPlanned);
	}

	return realtime;
};

export {parseJourney};
