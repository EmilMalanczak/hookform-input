import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, PropsWithChildren } from 'react';
import type { Control, FieldValues, Path, UseControllerProps, UseControllerReturn } from 'react-hook-form';
import { useController } from 'react-hook-form';

import type { AutocompleteString, EmptyObject, PrefixedRecord } from './types';
import { DEFAULT_ADAPTER_KEY } from './adapter/default-adapter';
import { formInputAdapters } from './adapter/form-input-adapters';
import { genericForwardRef } from './helpers/generic-forward-ref';
import { getErrorFromController } from './helpers/get-error-from-controller';
import { getErrorMessage } from './helpers/get-error-message';
import { logInputEvent } from './helpers/log-input-event';
import { mergeRefs } from './helpers/merge-refs';

type PolymorphicProp<TInput extends ElementType> = {
    /**
     * The component used for the root node. Either a string to use a HTML element or a component.
     */
    input?: TInput;
};

// list of controller props with prefix
type AdditionalControllerProps<TForm extends FieldValues> = PrefixedRecord<
    Omit<UseControllerProps<TForm>, 'name' | 'control'>,
    '_controller'
>;

// Basically any these native elements and any React component are allowed
export type AllowedElement = ElementType<any, 'input' | 'select' | 'textarea'>;

// This is the type for the "ref" only
export type PolymorphicRef<TInput extends AllowedElement> = ComponentPropsWithRef<TInput>['ref'];

/**
 * This is the internal props for the component
 */
type FormInputInternalOwnProps<TForm extends FieldValues = FieldValues> = {
    /** 
        @string name of the field in form
      */
    name: Path<TForm>;

    /** 
      @string optional field from form fields to display error message
    */
    alternativeErrorKeys?: Path<TForm>[];
    /** 
      @boolean if true will log to console input changes with detailed information
    */
    debug?: boolean;
    /** 
      @string key to use for adapter
    */
    adapterKey?: AutocompleteString<keyof FormInputAdapterKeys>;
};

export type FormInputInternalBareProps<TForm extends FieldValues = FieldValues> = {
    /** 
       @object control object from useForm hook 
     */
    control: Control<TForm>;
};

export type FormInputComponentProps<TForm extends FieldValues> = UseControllerReturn<TForm, Path<TForm>> & {
    error?: string;
    name: string;
};

type PropsToOmit<C extends AllowedElement, P> = keyof PolymorphicProp<C> &
    keyof P &
    keyof FormInputInternalOwnProps &
    keyof FormInputInternalBareProps;

type PolymorphicComponentProp<TInput extends AllowedElement, TProps = EmptyObject> = PropsWithChildren<
    TProps & PolymorphicProp<TInput>
> &
    Omit<ComponentPropsWithoutRef<TInput>, PropsToOmit<TInput, TProps>>;

type PolymorphicComponentPropWithRef<TInput extends AllowedElement, TProps = EmptyObject> = PolymorphicComponentProp<
    TInput,
    TProps
> & {
    ref?: PolymorphicRef<TInput>;
};

export type FormInputProps<TForm extends FieldValues, TInput extends AllowedElement> = PolymorphicComponentPropWithRef<
    TInput,
    FormInputInternalOwnProps<TForm>
> &
    AdditionalControllerProps<TForm>;

function FormInputComponent<TForm extends FieldValues, TInput extends AllowedElement = 'input'>(
    {
        input,
        name,
        control,
        onChange: onInputComponentChange,
        onBlur: onInputComponentBlur,
        debug = false,
        alternativeErrorKeys,
        _controllerRules,
        _controllerShouldUnregister,
        _controllerDefaultValue,
        _controllerDisabled,
        adapterKey = DEFAULT_ADAPTER_KEY,
        ...rest
    }: FormInputProps<TForm, TInput> & FormInputInternalBareProps<TForm>,
    ref?: PolymorphicRef<TInput>,
) {
    const controller = useController<TForm, Path<TForm>>({
        name,
        control,
        rules: _controllerRules,
        shouldUnregister: _controllerShouldUnregister,
        defaultValue: _controllerDefaultValue,
        disabled: _controllerDisabled,
    });
    const { onChange, onBlur, ref: hookFormRef, value } = controller.field;

    const error = getErrorFromController(controller, alternativeErrorKeys);

    const InputComponent = input ?? 'input';

    const adapter = formInputAdapters.get(adapterKey as keyof FormInputAdapterKeys);

    const propsObject = {
        value,
        name,
        error: error ? getErrorMessage(error) : undefined,
        onChange: (...values: unknown[]) => {
            onChange(...values);

            onInputComponentChange?.(...values);

            if (debug) {
                logInputEvent('onChange', name, {
                    values,
                    name,
                    error,
                    field: controller.field,
                });
            }
        },
        onBlur: (...values: unknown[]) => {
            onBlur();

            onInputComponentBlur?.(...values);

            if (debug) {
                logInputEvent('onBlur', name, {
                    values,
                    name,
                    error,
                    field: controller.field,
                });
            }
        },
        ...controller,
    };

    return <InputComponent ref={mergeRefs(hookFormRef, ref)} {...adapter(propsObject as any, rest as any)} />;
}

FormInputComponent.displayName = 'FormInputBare';

export const FormInputBare = genericForwardRef(FormInputComponent);
