import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { observer } from 'mobx-react';
import '@one-for-all/style-guide-csslint';
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

import { applyStyle } from '../utils';
import store from '../store';

function CSSEditor(): JSX.Element {
  const [value, setValue] = useState('');

  const { spec, key } = store.currentCompStatus as ActiveConfigurationComponent;

  useEffect(() => {
    setValue(store.cssStore?.getInitCompCss(`${key}.${spec.title}`, spec.rules) || '');
  }, [key]);

  function handleSave(): void {
    store.cssStore?.setCss(`${key}.${spec.title}`, value, spec.rules, (msg) => toast.error(msg));
    const componentName = key;
    const componentCss = store.cssStore?.getComponentCss(componentName, store.currentComp?.specs || []);
    store.shadowRoot && applyStyle(componentName, componentCss || '', store.shadowRoot);
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
