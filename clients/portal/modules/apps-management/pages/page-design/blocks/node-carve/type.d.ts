/**
 * If type equals 'react-node' means component in canvas is allowed to accept children
 */
type PropsTypes = 'string' | 'number' | 'boolean' | 'object' | 'function' | 'react-node';

type BaseWillTypes =
  | 'Input'
  | 'Textarea'
  | 'Select'
  | 'Checkbox'
  | 'RadioGroup'
  | 'CheckboxGroup'
  | 'Switch'
  | 'NumberPicker';

/**
 * It will add more types
 */
type EnhanceWillTypes = 'ImageUrl' | 'TableBind';

type WillTypes = BaseWillTypes | EnhanceWillTypes;

export type PropsSpec = {
  label: string;
  name: string;
  type: PropsTypes;
  desc?: string;
  will?: WillTypes;
  willProps?: Record<string, unknown>;
  initialValue?: unknown;
};
