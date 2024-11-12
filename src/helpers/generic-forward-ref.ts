import type { MutableRefObject, ReactNode, RefAttributes, RefObject } from 'react';
import { forwardRef } from 'react';

import type { EmptyObject } from '../types';

export const genericForwardRef = forwardRef as <T, P = EmptyObject>(
    render: (props: P, ref: MutableRefObject<T> | RefObject<T>) => ReactNode | null,
) => (props: P & RefAttributes<T>) => ReactNode | null;
