import React, { useState } from 'react';
import cs from 'classnames';
import { Tab } from '@one-for-all/ui';
import StylePanel from '../style-panel';
import { useCtx } from '@pageDesign/ctx';
import { camelCase, kebabCase } from 'lodash';

import './index.scss';
import CssEditor from './components/code-editor';
import { toJS } from 'mobx';

function StyleCustomize(): JSX.Element {
  const { page } = useCtx();
  const [currentPanel, setCurrentPanel] = useState<string>('customStyle');
  const currentElemStyles = (page.activeElem.props.style && page.activeElem.props.style.value) || {};

  function handleCssEditorStyleChange(value?: string): void {
    const cssObj = cssStringToJsonObj(value);
    if (!cssObj) return;
    page.updateElemProperty(page.activeElem.id, 'props.style', cssObj);
    console.log('page.activeElem.props.style:', toJS(page.activeElem.props.style.value) );
  }

  const panels = [
    {
      id: 'customStyle',
      name: '自定义样式',
      content: <StylePanel />,
    },
    {
      id: 'cssSourceCode',
      name: '源代码编辑',
      content: (
        <CssEditor
          autoFocus
          theme='vs-dark'
          language='css'
          className='h-full'
          value={jsonObjToFormattedCssString(currentElemStyles, page.activeElem.id)}
          onChange={handleCssEditorStyleChange}
        />
      ),
    },
  ];

  return (
    <div className={cs('style-station')}>
      <Tab
        contentClassName='style-content'
        separator
        stretchNav
        items={panels}
        currentKey={currentPanel}
        onChange={setCurrentPanel}
      />
    </div>
  );
}

export default StyleCustomize;

export function matchCssClassBrackets(cssString: string): string[] {
  const classBracketsReg = /[\w.-]+{((.|\n)*?)}/g;
  return cssString?.match(classBracketsReg) || [];
}

export function jsonObjToFormattedCssString(
  cssObj: Record<string, string | number>,
  className: string,
): string {
  const cssStringArray = Object.keys(cssObj).map((key) => {
    const cssPropKey = kebabCase(key);
    const cssPropValue = cssObj[key];
    return `\t${cssPropKey}:${cssPropValue};\n`;
  });

  const cssFormateString = `.${className}{\n${cssStringArray.join('')}}`;
  return cssFormateString;
}

export function cssStringToJsonObj(formattedCssString?: string): Record<string, string | number> | undefined {
  if (!formattedCssString) return;

  const cssClassStringArray = matchCssClassBrackets(formattedCssString);

  if (!cssClassStringArray.length) return;

  const firstCssClassString = cssClassStringArray[0];

  const keyReg = /([\w-]+):/;
  const valueReg = /:([^:;]+);/;
  const cssPropReg = /[^:;\s][a-z-]+:[^:;]+;/g;
  const classContentString = firstCssClassString?.trim()?.match(/\{([^)]*)\}$/)?.[1];
  const cssPropsRawArray = classContentString?.match(cssPropReg) || [];
  const cssPropsKeyValueArray = cssPropsRawArray.map((cssPropString) => {
    const key = camelCase(keyReg.exec(cssPropString)?.[1]);
    const _value = valueReg.exec(cssPropString)?.[1].trim();
    const numValue = Number(_value);
    const value = _value && isNaN(numValue) ? _value : numValue;
    return [key, value];
  });
  const cssProperties = Object.fromEntries(cssPropsKeyValueArray);
  return cssProperties;
}
