const c = {
	NONE: Symbol('no loyalty card'),
	BAHNCARD: Symbol('Bahncard'),
	VORTEILSCARD: Symbol('VorteilsCard'),
	HALBTAXABO: Symbol('HalbtaxAbo'),
	VOORDEELURENABO: Symbol('Voordeelurenabo'),
	SHCARD: Symbol('SH-Card'),
	GENERALABONNEMENT: Symbol('General-Abonnement'),
	NL_40: Symbol('NL-40%'),
	AT_KLIMATICKET: Symbol('AT-KlimaTicket'),
};

const formatLoyaltyCard = (data) => {
	if (!data) {
		return {
			art: 'KEINE_ERMAESSIGUNG',
			klasse: 'KLASSENLOS',
		};
	}
	const cls = data.class === 1 ? 'KLASSE_1' : 'KLASSE_2';
	if (data.type.toString() === c.BAHNCARD.toString()) {
		return {
			art: 'BAHNCARD' + (data.business ? 'BUSINESS' : '') + data.discount,
			klasse: cls,
		};
	}
	if (data.type.toString() === c.VORTEILSCARD.toString()) {
		return {
			art: 'A-VORTEILSCARD',
			klasse: 'KLASSENLOS',
		};
	}
	if (data.type.toString() === c.HALBTAXABO.toString()) {
		return {
			art: 'CH-HALBTAXABO_OHNE_RAILPLUS',
			klasse: 'KLASSENLOS',
		};
	}
	if (data.type.toString() === c.GENERALABONNEMENT.toString()) {
		return {
			art: 'CH-GENERAL-ABONNEMENT',
			klasse: cls,
		};
	}
	if (data.type.toString() === c.NL_40.toString()) {
		return {
			art: 'NL-40_OHNE_RAILPLUS',
			klasse: 'KLASSENLOS',
		};
	}
	if (data.type.toString() === c.AT_KLIMATICKET.toString()) {
		return {
			art: 'KLIMATICKET_OE',
			klasse: 'KLASSENLOS',
		};
	}
	return {
		art: 'KEINE_ERMAESSIGUNG',
		klasse: 'KLASSENLOS',
	};
};
export {
	c as data,
	formatLoyaltyCard,
};
