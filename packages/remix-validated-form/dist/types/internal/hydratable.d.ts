/**
 * The purpose of this type is to simplify the logic
 * around data that needs to come from the server initially,
 * but from the internal state after hydration.
 */
export declare type Hydratable<T> = {
    hydrateTo: (data: T) => T;
    map: <U>(fn: (data: T) => U) => Hydratable<U>;
};
export declare const hydratable: {
    serverData: <T>(data: T) => Hydratable<T>;
    hydratedData: <T_1>() => Hydratable<T_1>;
    from: <T_2>(data: T_2, hydrated: boolean) => Hydratable<T_2>;
};
