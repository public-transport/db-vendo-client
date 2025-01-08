const formatTransfers = (transfers) => {
	if (transfers === -1) { // profiles may not accept -1: https://github.com/public-transport/db-vendo-client/issues/5
		return undefined;
	}
	return transfers;
};

export {
	formatTransfers,
};
