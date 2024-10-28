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
		this.#promise ??= new Promise(this.#executor);
		return this.#promise.then(onFulfilled, onRejected);
	}

	catch(onRejected) {
		this.#promise ??= new Promise(this.#executor);
		return this.#promise.catch(onRejected);
	}

	finally(onFinally) {
		this.#promise ??= new Promise(this.#executor);
		return this.#promise.finally(onFinally);
	}
}
