const locationFallback = (id, name, fallbackLocations) => {
	if (fallbackLocations && (id && fallbackLocations[id] || name && fallbackLocations[name])) {
		return fallbackLocations[id] || fallbackLocations[name];
	}
	return {
		type: 'location',
		id: id,
		name: name,
		location: null,
	};
};

const parseJourneyLeg = (ctx, pt, date, fallbackLocations) => { // pt = raw leg
	const {profile, opt} = ctx;

	const stops = pt.halte?.length && pt.halte || pt.stops?.length && pt.stops || [];
	const res = {
		origin: stops.length && profile.parseLocation(ctx, stops[0].ort || stops[0].station || stops[0])
			|| pt.abgangsOrt?.name && profile.parseLocation(ctx, pt.abgangsOrt)
			|| locationFallback(pt.abfahrtsOrtExtId, pt.abfahrtsOrt, fallbackLocations),
		destination: stops.length && profile.parseLocation(ctx, stops[stops.length - 1].ort || stops[stops.length - 1].station || stops[stops.length - 1])
			|| pt.ankunftsOrt?.name && profile.parseLocation(ctx, pt.ankunftsOrt)
			|| locationFallback(pt.ankunftsOrtExtId, pt.ankunftsOrt, fallbackLocations),
	};

	const cancelledDep = stops.length && profile.parseCancelled(stops[0]);
	const dep = profile.parseWhen(ctx, date, pt.abfahrtsZeitpunkt || pt.abgangsDatum || stops.length && (stops[0].abgangsDatum || stops[0].departureTime?.target), pt.ezAbfahrtsZeitpunkt || pt.ezAbgangsDatum || stops.length && (stops[0].ezAbgangsDatum || stops[0].departureTime?.timeType != 'SCHEDULE' && stops[0].departureTime?.predicted), cancelledDep,
	);
	res.departure = dep.when;
	res.plannedDeparture = dep.plannedWhen;
	res.departureDelay = dep.delay;
	if (dep.prognosedWhen) {
		res.prognosedDeparture = dep.prognosedWhen;
	}

	const cancelledArr = stops.length && profile.parseCancelled(stops[stops.length - 1]);
	const arr = profile.parseWhen(ctx, date, pt.ankunftsZeitpunkt || pt.ankunftsDatum || stops.length && (stops[stops.length - 1].ankunftsDatum || stops[stops.length - 1].arrivalTime?.target), pt.ezAnkunftsZeitpunkt || pt.ezAnkunftsDatum || stops.length && (stops[stops.length - 1].ezAnkunftsDatum || stops[stops.length - 1].arrivalTime?.timeType != 'SCHEDULE' && stops[stops.length - 1].arrivalTime?.predicted), cancelledArr,
	);
	res.arrival = arr.when;
	res.plannedArrival = arr.plannedWhen;
	res.arrivalDelay = arr.delay;
	if (arr.prognosedWhen) {
		res.prognosedArrival = arr.prognosedWhen;
	}

	/* TODO res.reachable risNotizen [
		{
			"key": "text.realtime.connection.brokentrip",
			"value": "Due to delays a connecting service may not be reachable."
		}
	] */

	if ((opt.polylines || opt.polyline) && pt.polylineGroup) {
		res.polyline = profile.parsePolyline(ctx, pt.polylineGroup); // TODO polylines not returned anymore, set "poly": true in request, apparently only works for /reiseloesung/verbindung
	}

	const type = pt.verkehrsmittel?.typ || pt.typ;
	if (type == 'WALK' || type == 'FUSSWEG' || type == 'TRANSFER') {
		if (res.origin?.id == res.destination?.id) {
			res.arrival = res.departure;
			res.plannedArrival = res.plannedDeparture;
			res.arrivalDelay = res.departureDelay;
		}
		res.public = true;
		res.walking = true;
		res.distance = pt.distanz || null;
		if (type == 'TRANSFER') {
			res.transfer = true;
		}
		// TODO res.checkin
	} else {
		res.tripId = pt.journeyId || pt.zuglaufId;
		res.line = profile.parseLine(ctx, pt) || null;
		res.direction = pt.verkehrsmittel?.richtung || pt.richtung || null;

		// TODO res.currentLocation
		// TODO trainStartDate?

		if (stops.length) {
			const arrPl = profile.parsePlatform(ctx,
				stops[stops.length - 1].gleis || stops[stops.length - 1].track?.target,
				stops[stops.length - 1].ezGleis || stops[stops.length - 1].track?.prediction,
				cancelledArr,
			);
			res.arrivalPlatform = arrPl.platform;
			res.plannedArrivalPlatform = arrPl.plannedPlatform;
			if (arrPl.prognosedPlatform) {
				res.prognosedArrivalPlatform = arrPl.prognosedPlatform;
			}
			// res.arrivalPrognosisType = null; // TODO

			const depPl = profile.parsePlatform(ctx,
				stops[0].gleis || stops[0].track?.target,
				stops[0].ezGleis || stops[0].track?.prediction,
				cancelledDep,
			);
			res.departurePlatform = depPl.platform;
			res.plannedDeparturePlatform = depPl.plannedPlatform;
			if (depPl.prognosedPlatform) {
				res.prognosedDeparturePlatform = depPl.prognosedPlatform;
			}
			// res.departurePrognosisType = null; // TODO


			if (opt.stopovers) {
				res.stopovers = stops.map(s => profile.parseStopover(ctx, s, date));
				// filter stations the train passes without stopping, as this doesn't comply with fptf (yet)
				res.stopovers = res.stopovers.filter((x) => !x.passBy);
			}
			if (opt.remarks) {
				res.remarks = profile.parseRemarks(ctx, pt);
			}
		}

		// TODO cycle, alternatives
	}

	if (cancelledDep || cancelledArr || pt.cancelled || pt.canceled) {
		res.cancelled = true;
		Object.defineProperty(res, 'canceled', {value: true});
	}

	const load = profile.parseLoadFactor(opt, pt.auslastungsmeldungen || pt.auslastungsInfos);
	if (load) {
		res.loadFactor = load;
	}

	return res;
};

export {
	parseJourneyLeg,
};
