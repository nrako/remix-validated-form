import { FormState } from "./createFormStore";
import { InternalFormId } from "./types";
export declare const useFormStore: <T>(formId: InternalFormId, selector: (state: FormState) => T) => T;
