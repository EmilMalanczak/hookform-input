import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import { createFormInput } from './form-input-factory';

describe('Form input factory', () => {
    const InputComponent = (
        props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
            error?: string;
            test?: string;
        },
    ) => <input {...props} data-testid="factory-input" aria-invalid={!!props.error} data-info={props.test} />;

    it('should render passed input component', () => {
        const Input = createFormInput(InputComponent);

        const Component = () => {
            const form = useForm();

            return (
                <FormProvider {...form}>
                    <Input name="test" />
                </FormProvider>
            );
        };

        render(<Component />);

        expect(screen.getByTestId('factory-input')).toBeInTheDocument();
    });

    it('should pass form props down to input component', () => {
        const Input = createFormInput(InputComponent);

        const Component = () => {
            const form = useForm({
                defaultValues: {
                    test: 'Some input value',
                },
                errors: {
                    test: {
                        message: 'some error',
                        type: 'value',
                    },
                },
            });

            return (
                <FormProvider {...form}>
                    <Input name="test" />
                </FormProvider>
            );
        };

        render(<Component />);

        const input = screen.getByRole('textbox');

        expect(input).toHaveAttribute('name', 'test');
        expect(input).toHaveAttribute('value', 'Some input value');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should pass defaultProps down to input component', () => {
        const Input = createFormInput(InputComponent, {
            defaultProps: {
                test: 'test',
            },
        });

        const Component = () => {
            const form = useForm();

            return (
                <FormProvider {...form}>
                    <Input name="test" />
                </FormProvider>
            );
        };

        render(<Component />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('data-info', 'test');
    });

    it('passes props correctly', () => {
        const Input = createFormInput(InputComponent);

        const Component = () => {
            const form = useForm({
                defaultValues: {
                    test: 'Some input value',
                },
                errors: {
                    test: {
                        message: 'some error',
                        type: 'value',
                    },
                },
            });

            return (
                <FormProvider {...form}>
                    <Input name="test" id="2137" />
                </FormProvider>
            );
        };

        render(<Component />);

        const input = screen.getByRole('textbox');

        expect(input).toHaveAttribute('name', 'test');
        expect(input).toHaveAttribute('value', 'Some input value');
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should render FormInput by default', () => {
        const Input = createFormInput(InputComponent);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const Component = () => {
            const form = useForm();

            return (
                <FormProvider {...form}>
                    <Input name="test" />
                </FormProvider>
            );
        };
    });

    it('should render FormInputBare when using bare param', () => {
        const Input = createFormInput(InputComponent, { bare: true });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const Component = () => {
            const form = useForm();

            return (
                <FormProvider {...form}>
                    {/* @ts-expect-error - error should be display due to lack of 'controler' prop */}
                    <Input name="test" />
                </FormProvider>
            );
        };
    });
});
