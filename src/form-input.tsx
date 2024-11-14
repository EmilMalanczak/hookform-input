import type { FieldValues } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import type { AllowedElement, FormInputProps, PolymorphicRef } from './form-input-bare';
import { FormInputBare } from './form-input-bare';
import { genericForwardRef } from './helpers/generic-forward-ref';

export function FormInputComponent<TForm extends FieldValues, TInput extends AllowedElement = 'input'>(
    props: Omit<FormInputProps<TForm, TInput>, 'control'>,
    ref?: PolymorphicRef<TInput>,
) {
    const { control } = useFormContext<TForm>();

    return <FormInputBare {...(props as any)} control={control} ref={ref} />;
}

FormInputComponent.displayName = 'FormInput';

export const FormInput = genericForwardRef(FormInputComponent);
