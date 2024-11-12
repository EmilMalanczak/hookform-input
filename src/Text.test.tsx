import { expect, it } from 'vitest';

import { renderWithUser } from './tests/render-with-user';

export const Text = () => <div>Hello, world!</div>;

it('renders text', () => {
    const result = renderWithUser(<Text />);

    expect(result.getByText('Hello, world!')).toBeInTheDocument();
});
