import { FieldErrors, TouchedFields, ValidationResult } from "../validation/types";
export declare type FormState = {
    fieldErrors: FieldErrors;
    isSubmitting: boolean;
    hasBeenSubmitted: boolean;
    touchedFields: TouchedFields;
    defaultValues: {
        [fieldName: string]: any;
    };
    action?: string;
    subaction?: string;
    isValid: boolean;
};
/**
 * Returns information about the form.
 *
 * @param formId the id of the form. Only necessary if being used outside a ValidatedForm.
 */
export declare const useFormState: (formId?: string | undefined) => FormState;
export declare type FormHelpers = {
    /**
     * Clear the error of the specified field.
     */
    clearError: (fieldName: string) => void;
    /**
     * Validate the specified field.
     */
    validateField: (fieldName: string) => Promise<string | null>;
    /**
     * Change the touched state of the specified field.
     */
    setTouched: (fieldName: string, touched: boolean) => void;
    /**
     * Validate the whole form and populate any errors.
     */
    validate: () => Promise<ValidationResult<unknown>>;
    /**
     * Clears all errors on the form.
     */
    clearAllErrors: () => void;
    /**
     * Resets the form.
     *
     * _Note_: The equivalent behavior can be achieved by calling formElement.reset()
     * or clicking a button element with `type="reset"`.
     */
    reset: () => void;
    /**
     * Submits the form, running all validations first.
     *
     * _Note_: This is equivalent to clicking a button element with `type="submit"` or calling formElement.submit().
     */
    submit: () => void;
    /**
     * Returns the current form values as FormData
     */
    getValues: () => FormData;
};
/**
 * Returns helpers that can be used to update the form state.
 *
 * @param formId the id of the form. Only necessary if being used outside a ValidatedForm.
 */
export declare const useFormHelpers: (formId?: string | undefined) => FormHelpers;
