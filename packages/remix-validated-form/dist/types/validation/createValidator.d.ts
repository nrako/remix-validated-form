import { CreateValidatorArg, Validator } from "..";
/**
 * Used to create a validator for a form.
 * It provides built-in handling for unflattening nested objects and
 * extracting the values from FormData.
 */
export declare function createValidator<T>(validator: CreateValidatorArg<T>): Validator<T>;
