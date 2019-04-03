import {expectType} from 'tsd';
import PLazy = require('.');

const lazyPromise = new PLazy<string>((resolve, reject) => {
	if (!true) {
		resolve('foo');
	} else {
		reject(new Error());
	}
});

expectType<PLazy<string>>(lazyPromise);

expectType<PLazy<number>>(PLazy.from(() => Promise.resolve(1)));
expectType<PLazy<number>>(PLazy.from(() => 1));
