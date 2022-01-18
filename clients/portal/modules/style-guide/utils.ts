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

export function applyStyle(compKey: string, css: string): void {
  const styleID = `custom-css-${compKey}`;
  const style = document.getElementById(styleID) || document.createElement('style');
  style.innerHTML = '';
  style.setAttribute('id', styleID);
  style.appendChild(document.createTextNode(css));
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
}
