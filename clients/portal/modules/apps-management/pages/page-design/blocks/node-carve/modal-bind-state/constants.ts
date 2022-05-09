import { ComputedProperty } from '@one-for-all/artery';

export const LOGIC_OPERATOR = ['&&', '||', '()', '!', '===', '!=='];

export const DEFAULT_COMPUTED_PROPERTY: ComputedProperty = {
  type: 'computed_property',
  deps: [],
  fallback: undefined,
  convertor: {
    type: 'state_convert_expression',
    expression: '',
  },
};

export const SHARED_STATES_SPEC = {
  a: { initial: '{"name":"a","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
  b: { initial: '{"name":"b","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
  c: { initial: '{"name":"c","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
  d: { initial: '{"name":"d","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
  e: { initial: '{"name":"e","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
  f: { initial: '{"name":"f","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
  g: { initial: '{"name":"g","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
};
