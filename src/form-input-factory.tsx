/* eslint-disable react/display-name */
import type { ComponentProps } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { AllowedElement, FormInputInternalBareProps, FormInputProps } from './form-input-bare';
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
    <TInput extends AllowedElement, TDefaultProps extends Partial<ComponentProps<TInput>>, TBare extends boolean>(
        input: TInput,
        { bare, defaultProps = {} as TDefaultProps }: InputFactoryParams<TDefaultProps, TBare> = {},
    ) =>
    <TForm extends FieldValues>(
        props: PropsWithDefaults<FormInputProps<TForm, TInput>, TDefaultProps> &
            // eslint-disable-next-line @typescript-eslint/no-empty-object-type
            (TBare extends true ? FormInputInternalBareProps<TForm> : {}),
    ) => {
        const InputComponent = bare ? FormInputBare : FormInput;

        return <InputComponent input={input} {...(defaultProps as any)} {...props} />;
    };
