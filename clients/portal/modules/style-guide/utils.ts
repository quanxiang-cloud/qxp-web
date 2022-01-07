// import { COMPONENT_MAP } from './constant';

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
    // const { classnames, property, type, title } = config;
    // (schema.properties as any)[`${classnames}&&${property || type}`] = {
    //   title,
    //   'x-component': COMPONENT_MAP[type],
    //   'x-component-props': {
    //     property,
    //   },
    // };
  });

  return schema;
}

export function schemaToInitCss(configSchemas: ComponentConfigType[], prefix?: string): string {
  let _initialValues = '';
  configSchemas.forEach((config) => {
    const _selector = `${prefix ? prefix + ' ' : ''}${config.selector}`;
    config.desc ? _initialValues += `/* ${config.desc} */\n` : '';
    _initialValues += `${_selector} {\n\n} \n`;
    if (config.pseudo) {
      config.pseudo.forEach(({ desc, selector }) => {
        desc ? _initialValues += `/* ${desc} */\n` : '';
        _initialValues += `${config.selector}:${selector} {\n\n} \n`;
      });
    }

    if (config.children) {
      _initialValues += schemaToInitCss(config.children, _selector);
    }
  });

  return _initialValues;
}
