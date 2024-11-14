export type PrefixedRecord<TObj, TPrefix extends string> = {
    [Key in keyof TObj as Key extends string ? `${TPrefix}${Capitalize<Key>}` : never]: TObj[Key];
};

declare const emptyObjectSymbol: unique symbol;
export type EmptyObject = { [emptyObjectSymbol]?: never };

export type AutocompleteString<T extends string> = T | (string & {});
