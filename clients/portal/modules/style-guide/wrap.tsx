import React, { useState, useEffect } from 'react';
import { CssNodePlain, generate, fromPlainObject } from 'css-tree';
import { Controlled as CodeMirror } from 'react-codemirror2';
// @ts-ignore
import csslint from 'csslint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/css/css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/css-lint';

import Drawer from '@c/drawer';
import Button from '@c/button';
import toast from '@lib/toast';

import { schemaToInitCss } from './utils';
import store from './store';

export default function componentWarp(compObj: ComponentObjectType) {
  return function ComponentConfig(props: any): JSX.Element {
    const [configVisible, setConfigVisible] = useState(false);
    const [value, setValue] = useState('');
    const { config_schema, Component, key } = compObj;

    useEffect(() => {
      if (!configVisible) {
        return;
      }

      setValue(store.customCssMap[key] || schemaToInitCss(config_schema));
    }, [configVisible]);

    function handleConfigChange(formData: Record<string, any>): void {
      const initCssTree: CssNodePlain = {
        type: 'StyleSheet',
        children: [],
      };

      const tmp: Record<string, any[]> = {};

      Object.entries(formData).forEach(([key, cssObj]) => {
        const classnames = key.split('&&')[0];
        if (classnames in tmp) {
          tmp[classnames].push(cssObj);
        } else {
          tmp[classnames] = [cssObj];
        }
      });

      Object.entries(tmp).forEach(([cn, cssObjList]) => {
        initCssTree.children.push({
          type: 'Rule',
          block: {
            type: 'Block',
            children: cssObjList,
          },
          prelude: {
            type: 'SelectorList',
            children: [{
              type: 'Selector',
              children: [{
                name: cn,
                type: 'ClassSelector',
              }],
            }],
          },
        });
      });

      const styleID = `custom-css-${key}`;

      const css = generate(fromPlainObject(initCssTree));
      const style = document.getElementById(styleID) || document.createElement('style');
      style.innerHTML = '';
      style.setAttribute('id', styleID);
      style.appendChild(document.createTextNode(css));
      const head = document.getElementsByTagName('head')[0];
      head.appendChild(style);
      store.setCustomCss(key, css);
    }

    function handleSave(): void {
      const results = csslint.verify(value);
      if (!results.messages.every(({ type }: any) => type !== 'error')) {
        toast.error('css 格式错误');
        return;
      }

      const style = document.getElementById('custom-css') || document.createElement('style');
      style.innerHTML = '';
      style.setAttribute('id', 'custom-css');
      style.appendChild(document.createTextNode(value));
      const head = document.getElementsByTagName('head')[0];
      head.appendChild(style);
      store.setCustomCss(key, value);
    }

    return (
      <>
        <div onClick={() => setConfigVisible(true)}>
          <Component {...props} />
        </div>
        <Drawer
          position="right"
          title='配置'
          onCancel={() => setConfigVisible(false)}
          visible={configVisible}
        >
          <div className='p-10'>
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
        </Drawer>
      </>
    );
  };
}
