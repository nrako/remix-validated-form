import { Validator } from "remix-validated-form";
import type { AnyObjectSchema, InferType } from "yup";
/**
 * Create a `Validator` using a `yup` schema.
 */
export declare const withYup: <Schema extends AnyObjectSchema>(validationSchema: Schema) => Validator<InferType<Schema>>;
