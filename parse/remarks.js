import flatMap from 'lodash/flatMap.js';

const parseRemarks = (ctx, ref) => {
	// TODO ereignisZusammenfassung, priorisierteMeldungen?
	return flatMap([
		ref.disruptions || [],
		ref.risNotizen || [],
		ref.echtzeitNotizen && ref.echtzeitNotizen.map(e => {
			e.prio = 'HOCH'; return e;
		}) || [],
		ref.himMeldungen || [],
		ref.himNotizen || [],
		ref.hims || [],
		ref.serviceNotiz && [ref.serviceNotiz] || [],
		ref.messages || [],
		ref.meldungen || [],
		ref.meldungenAsObject || [],
		ref.attributNotizen || [],
		ref.attributes || [],
		ref.verkehrsmittel?.zugattribute || [],
	])
		.map(remark => {
			if (remark.kategorie || remark.priority) {
				const res = ctx.profile.parseHintByCode(remark);
				if (res) {
					return res;
				}
			}
			let type = 'hint';
			if (remark.prioritaet || remark.prio || remark.type) {
				type = 'status';
			}
			if (!remark.priority && !remark.kategorie && remark.key || remark.disruptionID
				|| remark.prioritaet && remark.prioritaet == 'HOCH' || remark.prio && remark.prio == 'HOCH' || remark.priority && remark.priority < 100) {
				type = 'warning';
			}
			let res = {
				code: remark.code || remark.key || remark.id,
				summary: remark.nachrichtKurz || remark.value || remark.ueberschrift || remark.text || remark.shortText
				|| Object.values(remark.descriptions || {})
					.shift()?.textShort,
				text: remark.nachrichtLang || remark.value || remark.text || remark.caption
				|| Object.values(remark.descriptions || {})
					.shift()?.text,
				type: type,
			};
			if (remark.modDateTime || remark.letzteAktualisierung) {
				res.modified = ctx.profile.parseDateTime(ctx, null, remark.modDateTime || remark.letzteAktualisierung);
			}
			if (remark.priority) {
				res.priority = remark.priority;
			}
			// TODO fromStops, toStops = routeIdxFrom ??
			return res;
		})
		.filter(remark => remark.code != 'BEF' && remark.code != 'OP');
};

/*
	meldungenAsObject
    {
        "code": "MDA-AK-MSG-1000",
        "nachrichtKurz": "Connection is in the past.",
        "nachrichtLang": "Selected connection is in the past.",
        "fahrtRichtungKennzeichen": "HINFAHRT"
    }
	[
    {
        "code": "MDA-AK-MSG-3000",
        "nachrichtKurz": "Booking not possible.",
        "nachrichtLang": "Booking is no longer possible for the connection you selected",
        "fahrtRichtungKennzeichen": "HINFAHRT"
    }
	]

	priorisierteMeldungen
    {
        "prioritaet": "HOCH",
        "text": "ICE 597 departs differently from Mainz Hbf from Platform 1b"
    }
	[
    {
        "prioritaet": "NIEDRIG",
        "text": "Advance notice! In the period from 15.12.24 to 17.01.25, construction work will take place between Mainz Hbf and Frankfurt(Main)Hbf. There will be changed run times and partial cancellation. Please inform yourself early on the Internet and at the stations."
    },
    {
        "prioritaet": "HOCH",
        "text": "The route between Mainz Hbf and Mainz Nord is currently closed. The reason is a repair on the track. At the moment, no train journeys are possible in the affected section of the route. As a result, there are now delays and partial failures. The trains terminates and starts unscheduled in Mainz Hbf. Please check your travel connections shortly before the train departs. This message will be updated as soon as we have more information."
    }
	]
	[
    {
        "prioritaet": "HOCH",
        "text": "Trip is not possible"
    }
	]
	[
    {
        "prioritaet": "HOCH",
        "text": "Intervention by authorities"
    },
    {
        "prioritaet": "HOCH",
        "text": "Switch repairs between Frankfurt(Main)Hbf and Mannheim Hbf delays rail transport. The train is diverted. The stop Mainz Hbf is cancelled. Please allow for a delay of up to 10 minutes. Please check for any changes to your journey prior to departure."
    }
	]
	[
    {
        "prioritaet": "HOCH",
        "text": "Stop cancelled",
        "type": "HALT_AUSFALL"
    }
	]

	risNotizen
	{
	"key": "text.realtime.connection.platform.change",
	"value": "ICE 597 departs differently from Mainz Hbf from Platform 1b"
	}
	{key: "FT", value: "Staff delayed due to earlier journey", routeIdxFrom: 0, routeIdxTo: 12}
	[
    {
        "key": "text.realtime.connection.cancelled",
        "value": "Trip is not possible"
    }
	]
	[
    {
        "key": "FT",
        "value": "Intervention by authorities",
        "routeIdxFrom": 9,
        "routeIdxTo": 21
    }
	]
	[
    {
        "key": "text.realtime.stop.cancelled",
        "value": "Stop cancelled"
    }
	]

	himMeldungen
	[
    {
        "ueberschrift": "Construction work.",
        "text": "Advance notice! In the period from 15.12.24 to 17.01.25, construction work will take place between Mainz Hbf and Frankfurt(Main)Hbf. There will be changed run times and partial cancellation. Please inform yourself early on the Internet and at the stations.",
        "prioritaet": "NIEDRIG",
        "modDateTime": "2024-12-03T12:52:29"
    },
    {
        "ueberschrift": "Disruption.",
        "text": "The route between Mainz Hbf and Mainz Nord is currently closed. The reason is a repair on the track. At the moment, no train journeys are possible in the affected section of the route. As a result, there are now delays and partial failures. The trains terminates and starts unscheduled in Mainz Hbf. Please check your travel connections shortly before the train departs. This message will be updated as soon as we have more information.",
        "prioritaet": "HOCH",
        "modDateTime": "2024-12-06T06:24:35"
    }
	[
    {
        "ueberschrift": "Disruption.",
        "text": "Switch repairs between Frankfurt(Main)Hbf and Mannheim Hbf delays rail transport. The train is diverted. The stop Mainz Hbf is cancelled. Please allow for a delay of up to 10 minutes. Please check for any changes to your journey prior to departure.",
        "prioritaet": "HOCH",
        "modDateTime": "2024-12-05T19:01:48"
    }
	]

    zugattribute
    [
    {
        "kategorie": "BEFÖRDERER",
        "key": "BEF",
        "value": "DB Fernverkehr AG"
    },
    {
        "kategorie": "BORDBISTRO",
        "key": "BR",
        "value": "Bordrestaurant",
        "teilstreckenHinweis": "(Mainz Hbf - Mannheim Hbf)"
    },
    {
        "kategorie": "FAHRRADMITNAHME",
        "key": "FR",
        "value": "Bicycles conveyed - subject to reservation",
        "teilstreckenHinweis": "(Mainz Hbf - Mannheim Hbf)"
    },
    {
        "kategorie": "FAHRRADMITNAHME",
        "key": "FB",
        "value": "Number of bicycles conveyed limited",
        "teilstreckenHinweis": "(Mainz Hbf - Mannheim Hbf)"
    },
    {
        "kategorie": "INFORMATION",
        "key": "CK",
        "value": "Komfort Check-in possible (visit bahn.de/kci for more information)",
        "teilstreckenHinweis": "(Mainz Hbf - Mannheim Hbf)"
    },
    {
        "kategorie": "INFORMATION",
        "key": "EH",
        "value": "vehicle-mounted access aid",
        "teilstreckenHinweis": "(Mainz Hbf - Mannheim Hbf)"
    }
    ]
*/

const parseCancelled = (ref) => {
	return ref.canceled
		|| ref.cancelled
		|| ref.journeyCancelled
		|| (ref.risNotizen || ref.echtzeitNotizen || ref.meldungen) && Boolean(
			(ref.risNotizen || ref.echtzeitNotizen || ref.meldungen).find(r => r.key == 'text.realtime.stop.cancelled'
			|| r.type == 'HALT_AUSFALL'
			|| r.text == 'Halt entfällt'
			|| r.text == 'Stop cancelled',
			),
		);
};

export {
	parseRemarks,
	parseCancelled,
};
