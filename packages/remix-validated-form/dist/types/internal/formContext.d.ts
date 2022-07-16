/// <reference types="react" />
import { useFetcher } from "@remix-run/react";
export declare type InternalFormContextValue = {
    formId: string | symbol;
    action?: string;
    subaction?: string;
    defaultValuesProp?: {
        [fieldName: string]: any;
    };
    fetcher?: ReturnType<typeof useFetcher>;
};
export declare const InternalFormContext: import("react").Context<InternalFormContextValue | null>;
