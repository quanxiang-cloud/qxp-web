import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import '@one-for-all/style-guide-csslint';

import toast from '@lib/toast';

import { applyStyle } from '../utils';
import store from '../store';

const CodeMirror = React.lazy(() => import('./codemirror'));

function CSSEditor(): JSX.Element {
  const [value, setValue] = useState('');
  const [isFocus, setFocus] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const { spec, key } = store.currentCompStatus as ActiveConfigurationComponent;

  useEffect(() => {
    setValue(store.cssStore?.getInitCompCss(`${key}.${spec.title}`, spec.rules) || '');
  }, [store.currentCompStatus]);

  useEffect(() => {
    if (isFocus) {
      return;
    }
    handleSave();
  }, [isFocus]);

  function handleSave(): void {
    if (!isChanged) {
      return;
    }

    store.cssStore?.setCss(`${key}.${spec.title}`, value, spec.rules, (msg) => toast.error(msg));
    const css = store.cssStore?.getCssString();
    store.shadowRoot && applyStyle(css || '', store.shadowRoot);
    setIsChanged(false);
  }

  return (
    <div className='pr-16'>
      <React.Suspense fallback={<div>loading...</div>}>
        <CodeMirror
          className='style-guide-code-editor'
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
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
            setIsChanged(true);
            setValue(value);
          }}
        />
      </React.Suspense>
    </div>
  );
}

export default observer(CSSEditor);
