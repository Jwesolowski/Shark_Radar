import SchemaAttribute from "../SchemaAttribute.js";

class WidthAttribute extends SchemaAttribute {
	/**
	 * @param {number} value
	 */
	constructor(value) {
		super(value, true);
	}

	static #sizes = Object.freeze({
		AUTO: 0,
		EXTRA_SMALL: 50,
		SMALL: 100,
		MEDIUM: 150,
		LARGE: 300,
		EXTRA_LARGE: 400,
		EXTRA_EXTRA_LARGE: 500
	});

	static Size = Object.freeze({
		AUTO: this.#sizes.AUTO,
		EXTRA_SMALL: this.#sizes.EXTRA_SMALL,
		XS: this.#sizes.EXTRA_SMALL,
		SMALL: this.#sizes.SMALL,
		SM: this.#sizes.SMALL,
		MEDIUM: this.#sizes.MEDIUM,
		MD: this.#sizes.MEDIUM,
		DEFAULT: this.#sizes.MEDIUM,
		LARGE: this.#sizes.LARGE,
		LG: this.#sizes.LARGE,
		EXTRA_LARGE: this.#sizes.EXTRA_LARGE,
		XL: this.#sizes.EXTRA_LARGE,
		EXTRA_EXTRA_LARGE: this.#sizes.EXTRA_EXTRA_LARGE,
		XXL: this.#sizes.EXTRA_EXTRA_LARGE
	});
}

export default WidthAttribute;
