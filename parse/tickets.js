const PARTIAL_FARE_HINT = 'Teilpreis / partial fare';

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

	// For Verbundtickets, try to get the lowest price from reiseAngebote
	if (raw.reiseAngebote && raw.reiseAngebote.length > 0) {
		let lowestPrice = null;
		for (const angebot of raw.reiseAngebote) {
			const fahrtAngebote = angebot.hinfahrt?.fahrtAngebote;
			if (fahrtAngebote && fahrtAngebote.length > 0) {
				for (const fahrt of fahrtAngebote) {
					if (fahrt.preis?.betrag && (!lowestPrice || fahrt.preis.betrag < lowestPrice.amount)) {
						lowestPrice = {
							amount: fahrt.preis.betrag,
							currency: fahrt.preis.waehrung,
							hint: null,
							partialFare: fahrt.teilpreis || false,
						};
					}
				}
			}
			// Also check direct price on reiseAngebot
			if (angebot.preis?.betrag && (!lowestPrice || angebot.preis.betrag < lowestPrice.amount)) {
				lowestPrice = {
					amount: angebot.preis.betrag,
					currency: angebot.preis.waehrung,
					hint: null,
					partialFare: angebot.teilpreis || false,
				};
			}
		}
		if (lowestPrice) {
			return lowestPrice;
		}
	}

	return undefined;
};

const parseTickets = (ctx, j) => {
	if (!ctx.opt.tickets) {
		return undefined;
	}
	let tickets = undefined;
	let price = parsePrice(ctx, j);
	// Handle DB Navigator mobile API format
	let ang = j.reiseAngebote;

	// If no reiseAngebote, check for angebote.angebotsCluster (DB Navigator mobile format)
	if (!ang && j.angebote?.angebotsCluster) {
		ang = j.angebote.angebotsCluster.flatMap(c => c.angebotsSubCluster
			.flatMap(c => c.angebotsPositionen
				.flatMap(p => {
					// Extract all possible ticket types from DB Navigator format
					const positions = [];

					// Handle verbundAngebot
					if (p.verbundAngebot?.reisePosition?.reisePosition) {
						const rp = p.verbundAngebot.reisePosition.reisePosition;
						rp.teilpreis = Boolean(p.verbundAngebot.reisePosition.teilpreisInformationen?.length);
						positions.push(rp);
					}

					// Handle regular einfacheFahrt
					if (p.einfacheFahrt?.standard?.reisePosition) {
						const rp = p.einfacheFahrt.standard.reisePosition.reisePosition || p.einfacheFahrt.standard.reisePosition;
						rp.teilpreis = Boolean(p.einfacheFahrt.standard.teilpreisInformationen?.length);
						positions.push(rp);
					}

					// Handle upsell
					if (p.einfacheFahrt?.upsellEntgelt?.einfacheFahrt?.reisePosition) {
						const rp = p.einfacheFahrt.upsellEntgelt.einfacheFahrt.reisePosition.reisePosition || p.einfacheFahrt.upsellEntgelt.einfacheFahrt.reisePosition;
						rp.teilpreis = Boolean(p.einfacheFahrt.upsellEntgelt.einfacheFahrt.teilpreisInformationen?.length);
						positions.push(rp);
					}

					return positions;
				}),
			),
		);
	}
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
					firstClass: s.klasse == 'KLASSE_1' || s.premium || Boolean(s.nutzungsInformationen?.find(i => i.klasse == 'KLASSE_1')),
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
	} else if (j.reiseAngebote && j.reiseAngebote.length > 0) {
		// Handle Verbundtickets in initial journey response
		tickets = [];
		for (const angebot of j.reiseAngebote) {
			// Extract tickets from fahrtAngebote
			const fahrtAngebote = angebot.hinfahrt?.fahrtAngebote;
			if (fahrtAngebote && fahrtAngebote.length > 0) {
				for (const fahrt of fahrtAngebote) {
					if (fahrt.preis?.betrag && fahrt.name) {
						const ticket = {
							name: fahrt.name,
							priceObj: {
								amount: Math.round(fahrt.preis.betrag * 100),
								currency: fahrt.preis.waehrung,
							},
							firstClass: fahrt.klasse === 'KLASSE_1',
							partialFare: fahrt.teilpreis || false,
						};
						// Add additional info if available
						const conds = fahrt.konditionsAnzeigen || fahrt.konditionen;
						if (conds) {
							ticket.addDataTicketInfo = conds.map(a => a.anzeigeUeberschrift || a.bezeichnung)
								.join('. ');
							ticket.addDataTicketDetails = conds.map(a => a.textLang || a.details)
								.join(' ');
						}
						tickets.push(ticket);
					}
				}
			}
			// Also check if reiseAngebot has direct price/name
			if (angebot.preis?.betrag && angebot.name) {
				const ticket = {
					name: angebot.name,
					priceObj: {
						amount: Math.round(angebot.preis.betrag * 100),
						currency: angebot.preis.waehrung,
					},
					firstClass: angebot.klasse === 'KLASSE_1',
					partialFare: angebot.teilpreis || false,
				};
				const conds = angebot.konditionsAnzeigen || angebot.konditionen;
				if (conds) {
					ticket.addDataTicketInfo = conds.map(a => a.anzeigeUeberschrift || a.bezeichnung)
						.join('. ');
					ticket.addDataTicketDetails = conds.map(a => a.textLang || a.details)
						.join(' ');
				}
				tickets.push(ticket);
			}
		}
		// Sort tickets by price (lowest first)
		if (tickets.length > 0) {
			tickets.sort((a, b) => a.priceObj.amount - b.priceObj.amount);
		}
	}
	return tickets;
};

export {
	parsePrice,
	parseTickets,
};
