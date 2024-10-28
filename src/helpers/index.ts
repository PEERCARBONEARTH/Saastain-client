import { ValidationResult } from "@/components/table/editable-table/AppEditableCell";
import { getMaxDate } from "@/utils";

export const NOOP = async (v?: any) => {
	// Does not do anything.
};

export const generateOptions = (options: string[]) => {
	return options.map((opt) => ({ value: opt, label: opt }));
};

export class AppEditableValidator {
	/**
	 * A simple string validator
	 * @param value Value to validate
	 * @param validationMessage Custom validation message
	 * @returns ValidationResult
	 */
	validateString(value: string, validationMessage?: string): ValidationResult {
		if (!value || value.trim() === "") {
			return { valid: false, error: validationMessage || "Field is required" };
		}

		return { valid: true, error: null };
	}

	/**
	 * A simple number validator
	 * @param value Value to validate
	 * @param validationMessage Custom validation message
	 * @returns ValidationResult
	 */
	validateNumber(value: number | string, validationMessage?: string): ValidationResult {
		const isNumber = typeof value === "number";

		const numVal = isNumber ? value : parseFloat(value as any);

		if (isNaN(numVal)) {
			return { valid: false, error: validationMessage || "Field is required" };
		}

		return { valid: true, error: null };
	}

	/**
	 * A simple date validator
	 * @param value Value to validate
	 * @param validationMessage Custom validation message
	 * @param checkFuture Check if the date is in the future
	 * @returns ValidationResult
	 */
	validateDate(value: string, validationMessage?: string, checkFuture = false): ValidationResult {
		const date = new Date(value);

		if (isNaN(date.getTime())) {
			return { valid: false, error: validationMessage || "Invalid Date" };
		}

		if (checkFuture) {
			const futureDate = getMaxDate();

			if (date > futureDate) {
				return { valid: false, error: "Date cannot be after today" };
			}

			return { valid: true, error: null };
		}

		return { valid: true, error: null };
	}
}
