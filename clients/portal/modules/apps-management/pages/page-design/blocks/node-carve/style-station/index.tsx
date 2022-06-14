import React, { useMemo, useState } from 'react';
import cs from 'classnames';
import { get } from 'lodash';

import { Tab } from '@one-for-all/ui';

import StyleMirror from './style-mirror';
import CssEditor from './code-editor';
import { useConfigContext } from '../context';
import { updateNodeProperty } from '../utils';
import { cssStringToJsonObj, jsonObjToFormattedCssString } from './utils';

import './index.scss';

function StyleStation(): JSX.Element {
  const [currentPanel, setCurrentPanel] = useState<string>('style-mirror');
  const { artery, rawActiveNode, onArteryChange } = useConfigContext() ?? {};
  const curElemStyles = useMemo(() =>get(rawActiveNode, 'props.style.value', {}), [artery] );

  function handleCssEditorStyleChange(value?: string): void {
    const styleObj = cssStringToJsonObj(value);
    if (!styleObj) return;
    if (rawActiveNode && artery) {
      const newArtery = updateNodeProperty(
        rawActiveNode,
        'props.style',
        { type: 'constant_property', value: styleObj },
        artery,
      );
      onArteryChange?.(newArtery);
    }
  }

  const panels = [
    {
      id: 'style-mirror',
      name: '自定义样式',
      content: <StyleMirror />,
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
          value={jsonObjToFormattedCssString(curElemStyles, `component-${rawActiveNode?.id}` || 'unknown-component')}
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

export default StyleStation;

