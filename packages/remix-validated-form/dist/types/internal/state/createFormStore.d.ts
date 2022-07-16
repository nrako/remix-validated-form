import { WritableDraft } from "immer/dist/internal";
import { FieldErrors, TouchedFields, ValidationResult, Validator } from "../../validation/types";
import { InternalFormId } from "./types";
export declare type SyncedFormProps = {
    formId?: string;
    action?: string;
    subaction?: string;
    defaultValues: {
        [fieldName: string]: any;
    };
    registerReceiveFocus: (fieldName: string, handler: () => void) => () => void;
    validator: Validator<unknown>;
};
export declare type FormStoreState = {
    forms: {
        [formId: InternalFormId]: FormState;
    };
    form: (formId: InternalFormId) => FormState;
    registerForm: (formId: InternalFormId) => void;
    cleanupForm: (formId: InternalFormId) => void;
};
export declare type FormState = {
    isHydrated: boolean;
    isSubmitting: boolean;
    hasBeenSubmitted: boolean;
    fieldErrors: FieldErrors;
    touchedFields: TouchedFields;
    formProps?: SyncedFormProps;
    formElement: HTMLFormElement | null;
    currentDefaultValues: Record<string, any>;
    isValid: () => boolean;
    startSubmit: () => void;
    endSubmit: () => void;
    setTouched: (field: string, touched: boolean) => void;
    setFieldError: (field: string, error: string) => void;
    setFieldErrors: (errors: FieldErrors) => void;
    clearFieldError: (field: string) => void;
    reset: () => void;
    syncFormProps: (props: SyncedFormProps) => void;
    setFormElement: (formElement: HTMLFormElement | null) => void;
    validateField: (fieldName: string) => Promise<string | null>;
    validate: () => Promise<ValidationResult<unknown>>;
    resetFormElement: () => void;
    submit: () => void;
    getValues: () => FormData;
    controlledFields: {
        values: {
            [fieldName: string]: any;
        };
        refCounts: {
            [fieldName: string]: number;
        };
        valueUpdatePromises: {
            [fieldName: string]: Promise<void>;
        };
        valueUpdateResolvers: {
            [fieldName: string]: () => void;
        };
        register: (fieldName: string) => void;
        unregister: (fieldName: string) => void;
        setValue: (fieldName: string, value: unknown) => void;
        kickoffValueUpdate: (fieldName: string) => void;
        getValue: (fieldName: string) => unknown;
        awaitValueUpdate: (fieldName: string) => Promise<void>;
        array: {
            push: (fieldName: string, value: unknown) => void;
            swap: (fieldName: string, indexA: number, indexB: number) => void;
            move: (fieldName: string, fromIndex: number, toIndex: number) => void;
            insert: (fieldName: string, index: number, value: unknown) => void;
            unshift: (fieldName: string, value: unknown) => void;
            remove: (fieldName: string, index: number) => void;
            pop: (fieldName: string) => void;
            replace: (fieldName: string, index: number, value: unknown) => void;
        };
    };
};
export declare const useRootFormStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<FormStoreState>, "setState"> & {
    setState(nextStateOrUpdater: FormStoreState | Partial<FormStoreState> | ((state: WritableDraft<FormStoreState>) => void), shouldReplace?: boolean | undefined): void;
}>;
