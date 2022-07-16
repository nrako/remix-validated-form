import { InternalFormContextValue } from "../formContext";
import { InternalFormId } from "./types";
export declare const useControlledFieldValue: (context: InternalFormContextValue, field: string) => any;
export declare const useRegisterControlledField: (context: InternalFormContextValue, field: string) => void;
export declare const useControllableValue: (context: InternalFormContextValue, field: string) => readonly [any, (value: unknown) => void];
export declare const useUpdateControllableValue: (formId: InternalFormId) => (field: string, value: unknown) => void;
export declare const useAwaitValue: (formId: InternalFormId) => (field: string) => Promise<void>;
