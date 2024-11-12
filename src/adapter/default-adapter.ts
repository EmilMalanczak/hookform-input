import type { AdapterObject } from './form-input-adapter.types';

export const DEFAULT_ADAPTER_KEY = '_default';

export const DEFAULT_ADAPTER: AdapterObject = {
    key: DEFAULT_ADAPTER_KEY,
    transformFn: (inputProps, otherProps) => ({ ...inputProps, ...otherProps }),
};
