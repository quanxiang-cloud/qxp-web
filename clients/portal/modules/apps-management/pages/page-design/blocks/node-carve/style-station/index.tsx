import React, { useMemo, useState } from 'react';
import cs from 'classnames';
import { get } from 'lodash';

import { Tab } from '@one-for-all/ui';

import StylePanel from '../style-panel';
import CssEditor from './code-editor';
import { useConfigContext } from '../context';
import { updateNodeProperty } from '../utils';
import { cssStringToJsonObj, jsonObjToFormattedCssString } from './utils';

import './index.scss';

function StyleStation(): JSX.Element {
  const [currentPanel, setCurrentPanel] = useState<string>('customStyle');
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
          value={jsonObjToFormattedCssString(curElemStyles, rawActiveNode?.id || 'unknown-component')}
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

