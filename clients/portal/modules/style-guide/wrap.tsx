import React, { useState, useMemo } from 'react';
import { SchemaForm } from '@formily/antd';
import { get } from 'lodash';
import { CssNodePlain, generate, fromPlainObject, toPlainObject, parse, DeclarationPlain } from 'css-tree';

import Drawer from '@c/drawer';

import configComponent from './config-component';
import store from './store';
import { getConfigFormSchema } from './utils';

export default function componentWarp(compObj: ComponentObjectType) {
  return function ComponentConfig(props: any): JSX.Element {
    const [configVisible, setConfigVisible] = useState(false);
    const { config_schema, Component, key } = compObj;

    const initialValues = useMemo(() => {
      if (!configVisible) {
        return;
      }

      const cssAst = parse(store.customCssMap[key]);
      toPlainObject(cssAst);
      const _initialValues: Record<string, DeclarationPlain> = {};
      (cssAst as any).children.forEach((ast: any)=> {
        const classnames = get(ast, 'prelude.children[0].children[0].name');
        ast.block.children.forEach((block: any) => {
          _initialValues[`${classnames}&&${block.property}`] = block;
        });
      });

      return _initialValues;
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

      const css = generate(fromPlainObject(initCssTree));
      const style = document.getElementById('custom-css') || document.createElement('style');
      style.innerHTML = '';
      style.setAttribute('id', 'custom-css');
      style.appendChild(document.createTextNode(css));
      const head = document.getElementsByTagName('head')[0];
      head.appendChild(style);
      store.setCustomCss(key, css);
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
            <SchemaForm
              initialValues={initialValues}
              onChange={handleConfigChange}
              components={configComponent}
              schema={getConfigFormSchema(config_schema)}
            />
          </div>
        </Drawer>
      </>
    );
  };
}
