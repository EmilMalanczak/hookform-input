import type { FieldValues, UseControllerReturn } from 'react-hook-form';

declare global {
    export interface FormInputAdapterKeys {
        _default: FormInputForwardedPropsBase;
    }
}

export type FormInputForwardedPropsBase = {
    error?: string | null;
    name: string;
    value: any;
    onChange: (...args: any[]) => void;
    onBlur: (...args: any[]) => void;
};

export type FormInputForwardedProps<Form extends FieldValues = FieldValues> = UseControllerReturn<Form> &
    FormInputForwardedPropsBase;

/**
 * A function type that maps the forwarded props from react-hook-form
 * to the component's props.
 *
 * @template ComponentProps - The type of the component's props.
 * @template Form - The type of the form values.
 *
 * @param {FormInputForwardedProps<Form>} forwardedProps - The forwarded props from react-hook-form.
 * @param {ComponentProps} otherProps - The standard props passed to the form input component.
 * @returns {ComponentProps} The new props after transformFn.
 */
export type MappingFunction<
    InputProps extends object,
    Form extends FieldValues = FieldValues,
    OutputProps extends object = InputProps,
> = (forwardedProps: FormInputForwardedProps<Form>, otherProps?: InputProps) => OutputProps;

export type GlobalAdapterProps<
    Key extends keyof FormInputAdapterKeys,
    InputType extends 'input' | 'output',
> = FormInputAdapterKeys[Key] extends {
    input: infer InputProps extends object;
    output: infer OutputProps extends object;
}
    ? InputType extends 'input'
        ? InputProps
        : OutputProps
    : FormInputAdapterKeys[Key];

export type AdapterObject<TKey = keyof FormInputAdapterKeys | string> = {
    [AdapterKey in keyof FormInputAdapterKeys]: {
        key: TKey;
        transformFn: TKey extends keyof FormInputAdapterKeys
            ? MappingFunction<
                  GlobalAdapterProps<AdapterKey, 'input'>,
                  FieldValues,
                  GlobalAdapterProps<AdapterKey, 'output'>
              >
            : MappingFunction<FormInputForwardedPropsBase, FieldValues, any>;
    };
}[keyof FormInputAdapterKeys];
