import { Validator } from "remix-validated-form";
import type { z } from "zod";
/**
 * Create a validator using a `zod` schema.
 */
export declare function withZod<T, U extends z.ZodTypeDef>(zodSchema: z.Schema<T, U, unknown>, parseParams?: Partial<z.ParseParams>): Validator<T>;
