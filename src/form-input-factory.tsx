/* eslint-disable react/display-name */
import type { ComponentProps } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormInputInternalBareProps, FormInputProps } from './form-input-bare';
import type { AllowedElement } from './types';
import { FormInput } from './form-input';
import { FormInputBare } from './form-input-bare';

type PropsWithDefaults<TProps, TDefaultProps> = Omit<TProps, keyof TDefaultProps> & Partial<TDefaultProps>;

type InputFactoryParams<TDefaultProps, TBare extends boolean> = {
    bare?: TBare;
    defaultProps?: TDefaultProps;
};

/**
 * Creates a FormInputBare component with the specified input element.
 * @param input - The input element to be used in the FormInput component.
 * @param defaultProps - The default props for the input element.
 * @returns A function that takes props and returns a FormInput component.
 */
export const createFormInput =
    <Input extends AllowedElement, TDefaultProps extends Partial<ComponentProps<Input>>, TBare extends boolean>(
        input: Input,
        { bare, defaultProps = {} as TDefaultProps }: InputFactoryParams<TDefaultProps, TBare> = {},
    ) =>
    <Form extends FieldValues>(
        props: PropsWithDefaults<FormInputProps<Form, Input>, TDefaultProps> &
            // eslint-disable-next-line @typescript-eslint/no-empty-object-type
            (TBare extends true ? FormInputInternalBareProps<Form> : {}),
    ) => {
        const InputComponent = bare ? FormInputBare : FormInput;

        return <InputComponent input={input} {...(defaultProps as any)} {...props} />;
    };
