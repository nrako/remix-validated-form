import React from "react";
export declare type FieldArrayValidationBehavior = "onChange" | "onSubmit";
export declare type FieldArrayValidationBehaviorOptions = {
    initial: FieldArrayValidationBehavior;
    whenSubmitted: FieldArrayValidationBehavior;
};
export declare type FieldArrayHelpers<Item = any> = {
    push: (item: Item) => void;
    swap: (indexA: number, indexB: number) => void;
    move: (from: number, to: number) => void;
    insert: (index: number, value: Item) => void;
    unshift: (value: Item) => void;
    remove: (index: number) => void;
    pop: () => void;
    replace: (index: number, value: Item) => void;
};
export declare type UseFieldArrayOptions = {
    formId?: string;
    validationBehavior?: Partial<FieldArrayValidationBehaviorOptions>;
};
export declare function useFieldArray<Item = any>(name: string, { formId, validationBehavior }?: UseFieldArrayOptions): [itemDefaults: Item[], helpers: FieldArrayHelpers<any>, error: string | undefined];
export declare type FieldArrayProps = {
    name: string;
    children: (itemDefaults: any[], helpers: FieldArrayHelpers, error: string | undefined) => React.ReactNode;
    formId?: string;
    validationBehavior?: FieldArrayValidationBehaviorOptions;
};
export declare const FieldArray: ({ name, children, formId, validationBehavior, }: FieldArrayProps) => JSX.Element;
