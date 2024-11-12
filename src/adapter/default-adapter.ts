import type { AdapterObject } from './form-input-adapter.types';

export const DEFAULT_ADAPTER_KEY = '_default';

export const DEFAULT_ADAPTER: AdapterObject = {
    key: DEFAULT_ADAPTER_KEY,
    transformFn: (
        {
            // skipping these properties because they not valid html attributes
            // if `input` component won't consume them, they will be passed down with rest operator
            // which might be hard to debug, so it's better to skip them
            // still they can be accessed in case of need proper adapter
            field,
            fieldState,
            formState,
            ...inputProps
        },
        otherProps,
    ) => ({ ...inputProps, ...otherProps }),
};
