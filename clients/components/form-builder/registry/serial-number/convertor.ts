export interface SerialConfig {
  title: string;
  description: string;
  displayModifier?: FormBuilder.DisplayModifier;
  numberPreview?: string;
  prefix?: string;
  initialPosition: number;
  initialValue: number;
  suffix?: string;
  appID?: string;
  id?: string;
}

export const defaultConfig: SerialConfig = {
  title: '流水号',
  description: '请输入',
  displayModifier: 'readonly',
  numberPreview: '',
  prefix: 'ER',
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
      template: `${value.prefix}.incr[name]{${value.initialPosition},${value.initialValue}}.step[name]{1}.${value.suffix}`,
      appID: value.appID || '',
      id: value.id,
    },
    ['x-internal']: {
      numberPreview: value.numberPreview,
      prefix: value.prefix,
      suffix: value.suffix,
      initialValue: value.initialValue,
      initialPosition: value.initialPosition,
    },
  };
}

export function toConfig(schema: ISchema): SerialConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: 'readonly',
    numberPreview: schema['x-internal']?.numberPreview as string,
    prefix: schema['x-internal']?.prefix as string,
    suffix: schema['x-internal']?.suffix as string,
    initialPosition: schema['x-internal']?.initialPosition as number,
    initialValue: schema['x-internal']?.initialValue as number,
    appID: schema['x-component-props']?.appID,
    id: schema['x-component-props']?.id as string,
  };
}
