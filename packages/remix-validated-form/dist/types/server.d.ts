import { FORM_DEFAULTS_FIELD } from "./internal/constants";
import { ValidatorError, ValidationErrorResponseData } from "./validation/types";
/**
 * Takes the errors from a `Validator` and returns a `Response`.
 * When you return this from your action, `ValidatedForm` on the frontend will automatically
 * display the errors on the correct fields on the correct form.
 *
 * You can also provide a second argument to `validationError`
 * to specify how to repopulate the form when JS is disabled.
 *
 * @example
 * ```ts
 * const result = validator.validate(await request.formData());
 * if (result.error) return validationError(result.error, result.submittedData);
 * ```
 */
export declare function validationError(error: ValidatorError, repopulateFields?: unknown, init?: ResponseInit): import("@remix-run/server-runtime").TypedResponse<ValidationErrorResponseData>;
export declare type FormDefaults = {
    [formDefaultsKey: `${typeof FORM_DEFAULTS_FIELD}_${string}`]: any;
};
export declare const setFormDefaults: <DataType = any>(formId: string, defaultValues: Partial<DataType>) => FormDefaults;
