export declare const getArray: (values: any, field: string) => unknown[];
export declare const swap: (array: unknown[], indexA: number, indexB: number) => void;
export declare const move: (array: unknown[], from: number, to: number) => void;
export declare const insert: (array: unknown[], index: number, value: unknown) => void;
export declare const remove: (array: unknown[], index: number) => void;
export declare const replace: (array: unknown[], index: number, value: unknown) => void;
/**
 * The purpose of this helper is to make it easier to update `fieldErrors` and `touchedFields`.
 * We key those objects by full paths to the fields.
 * When we're doing array mutations, that makes it difficult to update those objects.
 */
export declare const mutateAsArray: (field: string, obj: Record<string, any>, mutate: (arr: any[]) => void) => void;
