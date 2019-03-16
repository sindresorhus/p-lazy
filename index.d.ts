/**
Create a lazy promise that defers execution until `.then()` or `.catch()` is called.
*/
export default class PLazy<ValueType> extends Promise<ValueType> {
	/**
	Create a `PLazy` promise from a promise-returning or async function.
	*/
	static from<ValueType>(
		fn: () => ValueType | PromiseLike<ValueType>
	): PLazy<ValueType>;
}
