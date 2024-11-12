import type { MutableRefObject, Ref } from 'react';

type PossibleRef<T> = Ref<T> | MutableRefObject<T> | undefined;

function assignRef<T>(ref: PossibleRef<T>, value: T) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (typeof ref === 'object' && ref !== null && 'current' in ref) {
        (ref as MutableRefObject<T>).current = value;
    }
}

export function mergeRefs<T>(...refs: PossibleRef<T>[]) {
    return (node: T | null) => {
        refs.forEach((ref) => assignRef(ref, node));
    };
}
