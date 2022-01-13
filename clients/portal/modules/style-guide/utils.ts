export function schemaToInitCss(configSchemas: ComponentStyleConfigSchema[], prefix?: string): string {
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
