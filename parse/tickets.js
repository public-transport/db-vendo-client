const PARTIAL_FARE_HINT = 'Teilpreis / partial fare';

const unwrapTravelPosition = (position) => {
	let wrapper = position;
	let partialFare = false;
	while (wrapper?.reisePosition) {
		partialFare ||= Boolean(wrapper.teilpreisInformationen?.length);
		wrapper = wrapper.reisePosition;
	}
	if (!wrapper) {
		return null;
	}
	return {...wrapper, teilpreis: partialFare || Boolean(wrapper.teilpreis)};
};

const parseOfferPosition = (position) => {
	const candidates = [
		position.einfacheFahrt?.standard?.reisePosition,
		position.einfacheFahrt?.upsellEntgelt?.einfacheFahrt?.reisePosition,
		...(position.einfacheFahrt?.upsellAngebote || [])
			.map(a => a.upsellEntgelt?.einfacheFahrt?.reisePosition),
		position.verbundAngebot?.reisePosition,
		position.verbundAngebot?.standard?.reisePosition,
	];
	return candidates.map(unwrapTravelPosition)
		.filter(Boolean);
};

const parseOfferClusters = (clusters) => (clusters || [])
	.flatMap(cluster => cluster.angebotsSubCluster || [])
	.flatMap(cluster => cluster.angebotsPositionen || [])
	.flatMap(parseOfferPosition);

const parsePrice = (ctx, raw) => {
	const p = raw.angebotsPreis || raw.angebote?.preise?.gesamt?.ab || raw.abPreis;
	if (p?.betrag) {
		const partialFare = raw.hasTeilpreis ?? raw.angebote?.preise?.istTeilpreis ?? raw.teilpreis;
		return {
			amount: p.betrag,
			currency: p.waehrung,
			hint: partialFare ? PARTIAL_FARE_HINT : null,
			partialFare: partialFare,
		};
	}
	return undefined;
};

const parseTickets = (ctx, j) => {
	if (!ctx.opt.tickets) {
		return undefined;
	}
	let tickets = undefined;
	let price = parsePrice(ctx, j);
	const ang = j.reiseAngebote || parseOfferClusters(j.angebote?.angebotsCluster);
	if (ang && ang.length > 0) { // if refreshJourney()
		tickets = ang
			.filter(s => s.typ == 'REISEANGEBOT' && !s.angebotsbeziehungList?.flatMap(b => b.referenzen)
				.find(r => r.referenzAngebotsoption == 'PFLICHT'))
			.map((s) => {
				const p = {
					name: s.name,
					priceObj: {
						amount: Math.round(s.preis?.betrag * 100),
						currency: s.preis?.waehrung,
					},
					firstClass: s.klasse == 'KLASSE_1' || Boolean(s.nutzungsInformationen?.find(i => i.klasse == 'KLASSE_1')),
					partialFare: s.teilpreis,
				};
				if (s.teilpreis) {
					p.addData = PARTIAL_FARE_HINT;
				}
				const conds = s.konditionsAnzeigen || s.konditionen;
				if (conds) {
					p.addDataTicketInfo = conds.map(a => a.anzeigeUeberschrift || a.bezeichnung)
						.join('. ');
					p.addDataTicketDetails = conds.map(a => a.textLang || a.details)
						.join(' ');
				}
				if (s.leuchtturmInfo || s.leuchtturmText) {
					p.addDataTravelInfo = s.leuchtturmInfo?.text || s.leuchtturmText;
				}
				return p;
			});
		if (ctx.opt.generateUnreliableTicketUrls) {
			// TODO
		}

	} else if (price) { // if journeys()
		tickets = [{
			name: 'from',
			priceObj: {
				amount: Math.round(price.amount * 100),
				currency: price.currency,
			},
		}];
	}
	return tickets;
};

export {
	parsePrice,
	parseTickets,
};
