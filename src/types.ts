import type { ComponentPropsWithRef, ElementType } from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

type PrefixedRecord<Obj, Prefix extends string> = {
    [Key in keyof Obj as Key extends string ? `${Prefix}${Capitalize<Key>}` : never]: Obj[Key];
};

export type AdditionalControllerProps<Form extends FieldValues> = PrefixedRecord<
    Omit<UseControllerProps<Form>, 'name' | 'control'>,
    '_controller'
>;

export type AllowedElement = ElementType<any, 'input' | 'select' | 'textarea'>;

// This is the type for the "ref" only
export type PolymorphicRef<Input extends AllowedElement> = ComponentPropsWithRef<Input>['ref'];

declare const emptyObjectSymbol: unique symbol;
export type EmptyObject = { [emptyObjectSymbol]?: never };
