import test from 'ava';
import delay from 'delay';
import PLazy from '.';

const fixture = Symbol('fixture');

test('executor resolves', async t => {
	const steps = [];

	const lazyPromise = new PLazy(resolve => {
		steps.push('executor called');
		resolve(fixture);
	});

	steps.push('promise created');

	await delay(50);

	steps.push('then called');

	await lazyPromise.then(value => {
		t.is(value, fixture);
		steps.push('then-handler called');
	});

	t.deepEqual(steps, [
		'promise created',
		'then called',
		'executor called',
		'then-handler called'
	]);
});

test('executor rejects', async t => {
	const fixtureError = new Error('fixture');
	const steps = [];

	const lazyPromise = new PLazy((resolve, reject) => {
		steps.push('executor called');
		reject(fixtureError);
	});

	steps.push('promise created');

	await delay(50);

	steps.push('catch called');

	await lazyPromise.catch(error => {
		t.is(error, fixtureError);
		steps.push('catch-handler called');
	});

	t.deepEqual(steps, [
		'promise created',
		'catch called',
		'executor called',
		'catch-handler called'
	]);
});

test('executor is never called if no `then`', async t => {
	t.plan(1);
	new PLazy(resolve => { // eslint-disable-line no-new
		t.fail('executor should not be called');
		resolve();
	});

	await delay(50);
	t.pass();
});

test('executor is called with only catch handler', async t => {
	const steps = [];

	const lazyPromise = new PLazy(resolve => {
		steps.push('executor called');
		resolve();
	});

	steps.push('promise created');

	await delay(50);

	steps.push('catch called');

	await lazyPromise.catch(() => {});

	t.deepEqual(steps, [
		'promise created',
		'catch called',
		'executor called'
	]);
});

test('convert promise-returning function to lazy promise', async t => {
	let called = false;

	const lazyPromise = PLazy.from(async () => {
		called = true;
		return fixture;
	});

	t.true(lazyPromise instanceof PLazy);
	t.true(lazyPromise instanceof Promise);
	t.false(called);

	t.is(await lazyPromise, fixture);
	t.true(called);
});
