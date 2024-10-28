// TODO: Use private class fields when ESLint support it.

export default class PLazy extends Promise {
	#executor;
	#promise;

	constructor(executor) {
		super(resolve => {
			resolve();
		});

		this.#executor = executor;
	}

	static from(function_) {
		return new PLazy(resolve => {
			resolve(function_());
		});
	}

	static resolve(value) {
		return new PLazy(resolve => {
			resolve(value);
		});
	}

	static reject(error) {
		return new PLazy((resolve, reject) => {
			reject(error);
		});
	}

	then(onFulfilled, onRejected) {
		// TODO: Use `??=` when targeting Node.js 16.
		this.#promise = this.#promise || new Promise(this.#executor);
		return this.#promise.then(onFulfilled, onRejected);
	}

	catch(onRejected) {
		this.#promise = this.#promise || new Promise(this.#executor);
		return this.#promise.catch(onRejected);
	}

	finally(onFinally) {
		this.#promise = this.#promise || new Promise(this.#executor);
		return this.#promise.finally(onFinally);
	}
}
