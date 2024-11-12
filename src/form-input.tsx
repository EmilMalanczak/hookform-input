import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import type { FormInputProps } from './form-input-bare';
import type { AllowedElement, PolymorphicRef } from './types';
import { FormInputBare } from './form-input-bare';
import { genericForwardRef } from './helpers/generic-forward-ref';

export function FormInputComponent<Form extends FieldValues, Input extends AllowedElement = 'input'>(
    props: Omit<FormInputProps<Form, Input>, 'control'>,
    ref?: PolymorphicRef<Input>,
) {
    const { control } = useFormContext<Form>();

    return <FormInputBare {...(props as any)} control={control} ref={ref} />;
}

FormInputComponent.displayName = 'FormInput';

export const FormInput = genericForwardRef(FormInputComponent);
