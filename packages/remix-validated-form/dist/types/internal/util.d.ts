import type React from "react";
export declare const omit: (obj: any, ...keys: string[]) => any;
export declare const mergeRefs: <T = any>(refs: (React.MutableRefObject<T> | React.LegacyRef<T> | undefined)[]) => (instance: T | null) => void;
export declare const useIsomorphicLayoutEffect: typeof React.useEffect;
export declare const useDeepEqualsMemo: <T>(item: T) => T;
