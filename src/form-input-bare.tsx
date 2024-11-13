import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react';
import type { Control, FieldValues, Path, UseControllerReturn } from 'react-hook-form';
import { useController } from 'react-hook-form';

import type {
    AdditionalControllerProps,
    AllowedElement,
    AutocompleteString,
    EmptyObject,
    PolymorphicRef,
} from './types';
import { DEFAULT_ADAPTER_KEY } from './adapter/default-adapter';
import { formInputAdapters } from './adapter/form-input-adapters';
import { genericForwardRef } from './helpers/generic-forward-ref';
import { getErrorFromController } from './helpers/get-error-from-controller';
import { getErrorMessage } from './helpers/get-error-message';
import { logInputEvent } from './helpers/log-input-event';
import { mergeRefs } from './helpers/merge-refs';

type PolymorphicProp<Input extends ElementType> = {
    /**
     * The component used for the root node. Either a string to use a HTML element or a component.
     */
    input?: Input;
};

/**
 * This is the internal props for the component
 */
type FormInputInternalOwnProps<Form extends FieldValues = FieldValues> = {
    /** 
        @string name of the field in form
      */
    name: Path<Form>;

    /** 
      @string optional field from form fields to display error message
    */
    alternativeErrorKeys?: Path<Form>[];
    /** 
      @boolean if true will log to console input changes with detailed information
    */
    debug?: boolean;
    /** 
      @string key to use for adapter
    */
    adapterKey?: AutocompleteString<keyof FormInputAdapterKeys>;
};

export type FormInputInternalBareProps<Form extends FieldValues = FieldValues> = {
    /** 
       @object control object from useForm hook 
     */
    control: Control<Form>;
};

export type FormInputComponentProps<Form extends FieldValues> = UseControllerReturn<Form, Path<Form>> & {
    error?: string;
    name: string;
};

type PropsToOmit<C extends AllowedElement, P> = keyof PolymorphicProp<C> &
    keyof P &
    keyof FormInputInternalOwnProps &
    keyof FormInputInternalBareProps;

type PolymorphicComponentProp<Input extends AllowedElement, Props = EmptyObject> = PropsWithChildren<
    Props & PolymorphicProp<Input>
> &
    Omit<ComponentPropsWithoutRef<Input>, PropsToOmit<Input, Props>>;

type PolymorphicComponentPropWithRef<Input extends AllowedElement, Props = EmptyObject> = PolymorphicComponentProp<
    Input,
    Props
> & {
    ref?: PolymorphicRef<Input>;
};

export type FormInputProps<Form extends FieldValues, Input extends AllowedElement> = PolymorphicComponentPropWithRef<
    Input,
    FormInputInternalOwnProps<Form>
> &
    AdditionalControllerProps<Form>;

function FormInputComponent<Form extends FieldValues, Input extends AllowedElement = 'input'>(
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
    }: FormInputProps<Form, Input> & FormInputInternalBareProps<Form>,
    ref?: PolymorphicRef<Input>,
) {
    const controller = useController<Form, Path<Form>>({
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
