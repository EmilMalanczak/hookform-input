import type { FieldError } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import { getErrorMessage } from './get-error-message';

describe('getErrorMessage', () => {
    it('returns null if error is undefined', () => {
        const result = getErrorMessage(undefined);

        expect(result).toBeNull();
    });

    it('returns null if error does not have a message property', () => {
        const result = getErrorMessage({ type: 'test' });

        expect(result).toBeNull();
    });

    it('returns the error message if error has a message property', () => {
        const errorMessage = 'This is an error message';
        const result = getErrorMessage({ message: errorMessage } as FieldError);

        expect(result).toBe(errorMessage);
    });
});
