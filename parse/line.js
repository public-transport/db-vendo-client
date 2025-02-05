import slugg from 'slugg';

const parseLine = (ctx, p) => {
	const profile = ctx.profile;
	const fahrtNr = p.verkehrsmittel?.nummer || p.transport?.number || p.train?.no || p.no || ((p.risZuglaufId || '') + '_').split('_')[1] || p.verkehrsmittelNummer || ((p.verkehrmittel?.langText || '') + ' ').split(' ')[1] || ((p.mitteltext || '') + ' ').split(' ')[1] || ((p.zugName || '') + ' ').split(' ')[1];
	const res = {
		type: 'line',
		id: slugg(p.verkehrsmittel?.langText || p.verkehrmittel?.langText || p.transport?.journeyDescription || p.risZuglaufId || p.train && p.train.category + ' ' + p.train.lineName + ' ' + p.train.no || p.no && p.name + ' ' + p.no || p.langtext || p.mitteltext || p.zugName), // TODO terrible
		fahrtNr: String(fahrtNr),
		name: p.verkehrsmittel?.langText || p.verkehrsmittel?.name || p.verkehrmittel?.name || p.verkehrmittel?.langText || p.zugName || p.transport && p.transport.category + ' ' + p.transport.line || p.train && p.train.category + ' ' + p.train.lineName || p.name || p.mitteltext || p.langtext,
		public: true,
	};

	const adminCode = p.administrationId || p.administration?.id || p.administration?.administrationID;
	if (adminCode) {
		res.adminCode = adminCode;
	}
	res.productName = p.verkehrsmittel?.kurzText || p.verkehrmittel?.kurzText || p.transport?.category || p.train?.category || p.category || p.kurztext;
	const foundProduct = profile.products.find(pp => pp.vendo == p.verkehrsmittel?.produktGattung || pp.ris == p.transport?.type || pp.ris == p.train?.type || pp.ris == p.type || pp.ris_alt == p.train?.type || pp.ris_alt == p.type || pp.dbnav_short == p.produktGattung);
	res.mode = foundProduct?.mode;
	res.product = foundProduct?.id;

	res.operator = profile.parseOperator(ctx, p.verkehrsmittel?.zugattribute || p.zugattribute || p.attributNotizen || p.administration || p);
	return res;
};

export {
	parseLine,
};
