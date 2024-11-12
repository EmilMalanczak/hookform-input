import type { FieldError, FieldValues, Path, UseControllerReturn } from 'react-hook-form';
import { get } from 'react-hook-form';

type OptionalFieldError = FieldError | undefined;

export function getErrorFromController<Form extends FieldValues>(
    controller: UseControllerReturn<Form, Path<Form>>,
    alternativeErrorKeys?: Path<Form>[],
) {
    const { fieldState, formState } = controller;

    if (fieldState.error) return fieldState.error;

    if (alternativeErrorKeys) {
        for (const key of alternativeErrorKeys) {
            const value = get(formState.errors, key) as OptionalFieldError;

            if (value) return value;
        }
    }
}
