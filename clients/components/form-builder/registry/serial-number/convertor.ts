import { Format } from './prefix';

export type PrefixType = {
  frontward: string,
  backward: Format | '',
}

export interface SerialConfig {
  title: string;
  description?: string;
  displayModifier?: FormBuilder.DisplayModifier;
  numberPreview?: string;
  prefix?: PrefixType;
  initialPosition: number;
  initialValue: number;
  suffix?: string;
  appID?: string;
  id?: string;
}

export const defaultConfig: SerialConfig = {
  title: '流水号',
  description: '',
  displayModifier: 'readonly',
  numberPreview: '',
  prefix: {
    frontward: 'ER',
    backward: 'yyyyMMdd',
  },
  initialPosition: 5,
  initialValue: 1,
  suffix: '',
};

export function toSchema(value: SerialConfig): ISchema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: false,
    readOnly: true,
    display: true,
    'x-component': 'Serial',
    ['x-component-props']: {
      template: `${value.prefix?.frontward}.date{${value.prefix?.backward}}.incr[name]{${value.initialPosition},${value.initialValue}}.step[name]{1}.date{${value.suffix}}`,
      appID: value.appID || '',
      id: value.id,
      prefix: value.prefix,
      suffix: value.suffix,
      initialValue: value.initialValue,
      initialPosition: value.initialPosition,
      numberPreview: value.numberPreview,
    },
    ['x-internal']: {
      permission: 3,
    },
  };
}

export function toConfig(schema: ISchema): SerialConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: 'readonly',
    numberPreview: schema['x-component-props']?.numberPreview as string,
    prefix: schema['x-component-props']?.prefix,
    suffix: schema['x-component-props']?.suffix,
    initialPosition: schema['x-component-props']?.initialPosition as number,
    initialValue: schema['x-component-props']?.initialValue as number,
    appID: schema['x-component-props']?.appID,
    id: schema['x-component-props']?.id as string,
  };
}
