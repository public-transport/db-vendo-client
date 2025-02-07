const formatLocationFilter = (stops, addresses, poi) => {
	if (!addresses && !poi) { // TODO other combos?
		return 'HALTESTELLEN';
	}
	return 'ALL';
};

export {
	formatLocationFilter,
};
