import type { FieldError } from 'react-hook-form';

export function getErrorMessage(error?: FieldError) {
    return error?.message ?? null;
}
