import {expectType} from 'tsd';
import PLazy from './index.js';

const lazyPromise = new PLazy<string>((resolve, reject) => {
	if (true) { // eslint-disable-line no-constant-condition
		reject(new Error('fixture'));
	} else {
		resolve('foo');
	}
});

expectType<PLazy<string>>(lazyPromise);
expectType<PLazy<number>>(PLazy.from(async () => Promise.resolve(1)));
expectType<PLazy<number>>(PLazy.from(() => 1));
expectType<PLazy<number>>(PLazy.resolve(1));
expectType<PLazy<never>>(PLazy.reject(new Error('fixture')));
