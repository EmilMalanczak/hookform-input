import { createRef } from 'react';
import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import { FormInput } from './form-input';

describe('FormInput', () => {
    it('forwards ref correctly', () => {
        const ref = createRef<HTMLInputElement>();

        const Component = () => {
            const form = useForm();

            return (
                <FormProvider {...form}>
                    <FormInput name="test" ref={ref} />
                </FormProvider>
            );
        };

        render(<Component />);

        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
});
