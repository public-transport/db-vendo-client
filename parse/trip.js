const parseTrip = (ctx, t, id) => { // t = raw trip
	const {profile} = ctx;

	// pretend the trip is a leg in a journey
	const trip = profile.parseJourneyLeg(ctx, t);
	trip.id = trip.tripId || id;
	delete trip.tripId;
	delete trip.reachable;
	trip.cancelled = Boolean(profile.parseCancelled(t) || trip.stopovers?.length && trip.stopovers?.every(s => s.cancelled));

	// TODO opt.scheduledDays
	return trip;
};

export {
	parseTrip,
};
