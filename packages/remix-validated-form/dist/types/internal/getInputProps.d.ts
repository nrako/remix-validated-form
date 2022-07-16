export declare type ValidationBehavior = "onBlur" | "onChange" | "onSubmit";
export declare type ValidationBehaviorOptions = {
    initial: ValidationBehavior;
    whenTouched: ValidationBehavior;
    whenSubmitted: ValidationBehavior;
};
export declare type CreateGetInputPropsOptions = {
    clearError: () => void;
    validate: () => void;
    defaultValue?: any;
    touched: boolean;
    setTouched: (touched: boolean) => void;
    hasBeenSubmitted: boolean;
    validationBehavior?: Partial<ValidationBehaviorOptions>;
    name: string;
};
declare type HandledProps = "name" | "defaultValue" | "defaultChecked";
declare type Callbacks = "onChange" | "onBlur";
declare type MinimalInputProps = {
    onChange?: (...args: any[]) => void;
    onBlur?: (...args: any[]) => void;
    defaultValue?: any;
    defaultChecked?: boolean;
    name?: string;
    type?: string;
};
export declare type GetInputProps = <T extends MinimalInputProps>(props?: Omit<T, HandledProps | Callbacks> & Partial<Pick<T, Callbacks>>) => T;
export declare const createGetInputProps: ({ clearError, validate, defaultValue, touched, setTouched, hasBeenSubmitted, validationBehavior, name, }: CreateGetInputPropsOptions) => GetInputProps;
export {};
