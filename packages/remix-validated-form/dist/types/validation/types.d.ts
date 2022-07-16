export declare type FieldErrors = Record<string, string>;
export declare type TouchedFields = Record<string, boolean>;
export declare type GenericObject = {
    [key: string]: any;
};
export declare type ValidatorError = {
    subaction?: string;
    formId?: string;
    fieldErrors: FieldErrors;
};
export declare type ValidationErrorResponseData = {
    subaction?: string;
    formId?: string;
    fieldErrors: FieldErrors;
    repopulateFields?: unknown;
};
export declare type BaseResult = {
    submittedData: GenericObject;
    formId?: string;
};
export declare type ErrorResult = BaseResult & {
    error: ValidatorError;
    data: undefined;
};
export declare type SuccessResult<DataType> = BaseResult & {
    data: DataType;
    error: undefined;
};
/**
 * The result when validating a form.
 */
export declare type ValidationResult<DataType> = SuccessResult<DataType> | ErrorResult;
/**
 * The result when validating an individual field in a form.
 */
export declare type ValidateFieldResult = {
    error?: string;
};
/**
 * A `Validator` can be passed to the `validator` prop of a `ValidatedForm`.
 */
export declare type Validator<DataType> = {
    validate: (unvalidatedData: GenericObject) => Promise<ValidationResult<DataType>>;
    validateField: (unvalidatedData: GenericObject, field: string) => Promise<ValidateFieldResult>;
};
export declare type Valid<DataType> = {
    data: DataType;
    error: undefined;
};
export declare type Invalid = {
    error: FieldErrors;
    data: undefined;
};
export declare type CreateValidatorArg<DataType> = {
    validate: (unvalidatedData: GenericObject) => Promise<Valid<DataType> | Invalid>;
    validateField: (unvalidatedData: GenericObject, field: string) => Promise<ValidateFieldResult>;
};
export declare type ValidatorData<T extends Validator<any>> = T extends Validator<infer U> ? U : never;
