import { Form as RemixForm, useFetcher } from "@remix-run/react";
import React, { ComponentProps } from "react";
import { Validator } from "./validation/types";
export declare type FormProps<DataType> = {
    /**
     * A `Validator` object that describes how to validate the form.
     */
    validator: Validator<DataType>;
    /**
     * A submit callback that gets called when the form is submitted
     * after all validations have been run.
     */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
    /**
     * Allows you to provide a `fetcher` from remix's `useFetcher` hook.
     * The form will use the fetcher for loading states, action data, etc
     * instead of the default form action.
     */
    fetcher?: ReturnType<typeof useFetcher>;
    /**
     * Accepts an object of default values for the form
     * that will automatically be propagated to the form fields via `useField`.
     */
    defaultValues?: Partial<DataType>;
    /**
     * A ref to the form element.
     */
    formRef?: React.RefObject<HTMLFormElement>;
    /**
     * An optional sub-action to use for the form.
     * Setting a value here will cause the form to be submitted with an extra `subaction` value.
     * This can be useful when there are multiple forms on the screen handled by the same action.
     */
    subaction?: string;
    /**
     * Reset the form to the default values after the form has been successfully submitted.
     * This is useful if you want to submit the same form multiple times,
     * and don't redirect in-between submissions.
     */
    resetAfterSubmit?: boolean;
    /**
     * Normally, the first invalid input will be focused when the validation fails on form submit.
     * Set this to `false` to disable this behavior.
     */
    disableFocusOnError?: boolean;
} & Omit<ComponentProps<typeof RemixForm>, "onSubmit">;
/**
 * The primary form component of `remix-validated-form`.
 */
export declare function ValidatedForm<DataType>({ validator, onSubmit, children, fetcher, action, defaultValues: unMemoizedDefaults, formRef: formRefProp, onReset, subaction, resetAfterSubmit, disableFocusOnError, method, replace, id, ...rest }: FormProps<DataType>): JSX.Element;
