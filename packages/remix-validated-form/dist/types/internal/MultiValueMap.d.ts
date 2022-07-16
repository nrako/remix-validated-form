export declare class MultiValueMap<Key, Value> {
    private dict;
    add: (key: Key, value: Value) => void;
    delete: (key: Key) => void;
    remove: (key: Key, value: Value) => void;
    getAll: (key: Key) => Value[];
    entries: () => IterableIterator<[Key, Value[]]>;
    values: () => IterableIterator<Value[]>;
    has: (key: Key) => boolean;
}
export declare const useMultiValueMap: <Key, Value>() => () => MultiValueMap<Key, Value>;
