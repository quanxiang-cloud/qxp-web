import { COMPONENT_MAP } from './constant';

export function getConfigFormSchema(configSchemas: ComponentConfigType[]): ISchema {
  const schema = {
    type: 'object',
    'x-component-props': {
      labelCol: 7,
      wrapperCol: 12,
    },
    properties: {},
  };

  configSchemas.forEach((config) => {
    const { classnames, property, type, title } = config;
    (schema.properties as any)[`${classnames}&&${property || type}`] = {
      title,
      'x-component': COMPONENT_MAP[type],
      'x-component-props': {
        property,
      },
    };
  });

  return schema;
}
