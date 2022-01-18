import React, { useState, useEffect } from 'react';
import { StyleSheetPlain, AtrulePlain, generate, fromPlainObject, parse, toPlainObject } from 'css-tree';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { observer } from 'mobx-react';
import { get, isEqual } from 'lodash';
// @ts-ignore
import csslint from 'csslint';
import cssbeautify from 'cssbeautify';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/css/css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/css-lint';

import Button from '@c/button';
import toast from '@lib/toast';

import { schemaToInitCss } from '../utils';
import store from '../store';

function classFilter(css: string, configSchema: ComponentStyleConfigSchema[]): string {
  const cssAst = toPlainObject(parse(css)) as StyleSheetPlain;
  const initCssAst = toPlainObject(parse(schemaToInitCss(configSchema))) as StyleSheetPlain;
  const selectorPath = 'children[0].children';
  const initSelectors = initCssAst.children.map((rule) => {
    return get((rule as AtrulePlain).prelude, selectorPath);
  });

  cssAst.children = cssAst.children.filter((rule) => {
    const isPass = initSelectors.some((selector) => {
      return isEqual(selector, get((rule as AtrulePlain).prelude, selectorPath));
    });

    return isPass;
  });

  return generate(fromPlainObject(cssAst));
}

function CSSEditor(): JSX.Element {
  const [value, setValue] = useState('');

  const { configSchema, key } = store.currentCompStatus as ActiveConfigurationComponent;

  useEffect(() => {
    setValue(cssbeautify(store.customCompCssMap[key] || schemaToInitCss(configSchema)));
  }, [key]);

  function handleSave(): void {
    const results = csslint.verify(value);
    if (!results.messages.every(({ type }: any) => type !== 'error')) {
      toast.error('css 格式错误');
      return;
    }

    const newCss = classFilter(value, configSchema);
    store.setCustomCss(key, newCss);
  }

  return (
    <div className='p-10 bg-white'>
      <CodeMirror
        value={value}
        options={{
          mode: 'css',
          theme: 'material',
          lineNumbers: true,
          lint: true,
          gutters: ['CodeMirror-lint-markers'],
          extraKeys: {
            Alt: 'autocomplete',
          },
        }}
        onBeforeChange={(editor, data, value) => {
          setValue(value);
        }}
      />
      <Button className='mt-20' onClick={handleSave} >应用</Button>
    </div>
  );
}

export default observer(CSSEditor);
