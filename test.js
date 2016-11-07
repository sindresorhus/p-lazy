import test from 'ava';
import delay from 'delay';
import PLazy from './';

const fixture = Symbol('fixture');

test('executor resolves', async t => {
	const steps = [];

	const p = new PLazy(resolve => {
		steps.push('executor called');
		resolve(fixture);
	});

	steps.push('promise created');

	await delay(50);

	steps.push('then called');

	await p.then(val => {
		t.is(val, fixture);
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
	const fixtureErr = new Error('fixture');
	const steps = [];

	const p = new PLazy((resolve, reject) => {
		steps.push('executor called');
		reject(fixtureErr);
	});

	steps.push('promise created');

	await delay(50);

	steps.push('catch called');

	await p.catch(err => {
		t.is(err, fixtureErr);
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
	new PLazy(resolve => { // eslint-disable-line no-new
		t.fail('executor should not be called');
		resolve();
	});

	await delay(50);
});

test('executor is called with only catch handler', async t => {
	const steps = [];

	const p = new PLazy(resolve => {
		steps.push('executor called');
		resolve();
	});

	steps.push('promise created');

	await delay(50);

	steps.push('catch called');

	await p.catch(() => {});

	t.deepEqual(steps, [
		'promise created',
		'catch called',
		'executor called'
	]);
});

test('convert promise-returning function to lazy promise', async t => {
	let called = false;

	const p = PLazy.from(async () => {
		called = true;
		return fixture;
	});

	t.true(p instanceof PLazy);
	// TODO: remove `global.` when AVA targets Node.js 4
	t.true(p instanceof global.Promise);
	t.false(called);

	t.is(await p, fixture);
	t.true(called);
});
