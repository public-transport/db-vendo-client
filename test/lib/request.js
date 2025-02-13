// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import tap from 'tap';
import {
	checkIfResponseIsOk as checkIfResIsOk,
} from '../../lib/request.js';
import {
	HafasError,
} from '../../lib/errors.js';

const resNoMatch = {verbindungen: [], verbindungReference: {}, fehlerNachricht: {code: 'MDA-AK-MSG-1001', ueberschrift: 'Datum liegt außerhalb der Fahrplanperiode.', text: 'Das Datum liegt außerhalb der Fahrplanperiode.'}};

const secret = Symbol('secret');

tap.test('checkIfResponseIsOk properly throws HAFAS errors', (t) => {
	try {
		checkIfResIsOk({
			body: resNoMatch,
			errProps: {secret},
		});
	} catch (err) {
		t.ok(err);

		t.ok(err instanceof HafasError);
		t.equal(err.isHafasError, true);
		t.ok(err instanceof HafasError);
		t.equal(err.isCausedByServer, false);
		t.equal(err.code, 'MDA-AK-MSG-1001');

		t.equal(err.hafasMessage, 'Datum liegt außerhalb der Fahrplanperiode.');
		t.equal(err.hafasDescription, 'Das Datum liegt außerhalb der Fahrplanperiode.');

		t.end();
	}
});
