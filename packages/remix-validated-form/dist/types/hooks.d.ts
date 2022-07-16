import { GetInputProps, ValidationBehaviorOptions } from "./internal/getInputProps";
/**
 * Returns whether or not the parent form is currently being submitted.
 * This is different from remix's `useTransition().submission` in that it
 * is aware of what form it's in and when _that_ form is being submitted.
 *
 * @param formId
 */
export declare const useIsSubmitting: (formId?: string | undefined) => boolean;
/**
 * Returns whether or not the current form is valid.
 *
 * @param formId the id of the form. Only necessary if being used outside a ValidatedForm.
 */
export declare const useIsValid: (formId?: string | undefined) => boolean;
export declare type FieldProps = {
    /**
     * The validation error message if there is one.
     */
    error?: string;
    /**
     * Clears the error message.
     */
    clearError: () => void;
    /**
     * Validates the field.
     */
    validate: () => void;
    /**
     * The default value of the field, if there is one.
     */
    defaultValue?: any;
    /**
     * Whether or not the field has been touched.
     */
    touched: boolean;
    /**
     * Helper to set the touched state of the field.
     */
    setTouched: (touched: boolean) => void;
    /**
     * Helper to get all the props necessary for a regular input.
     */
    getInputProps: GetInputProps;
};
/**
 * Provides the data and helpers necessary to set up a field.
 */
export declare const useField: (name: string, options?: {
    /**
     * Allows you to configure a custom function that will be called
     * when the input needs to receive focus due to a validation error.
     * This is useful for custom components that use a hidden input.
     */
    handleReceiveFocus?: (() => void) | undefined;
    /**
     * Allows you to specify when a field gets validated (when using getInputProps)
     */
    validationBehavior?: Partial<ValidationBehaviorOptions> | undefined;
    /**
     * The formId of the form you want to use.
     * This is not necesary if the input is used inside a form.
     */
    formId?: string | undefined;
} | undefined) => FieldProps;
export declare const useControlField: <T>(name: string, formId?: string | undefined) => readonly [T, (value: T) => void];
export declare const useUpdateControlledField: (formId?: string | undefined) => (field: string, value: unknown) => void;
