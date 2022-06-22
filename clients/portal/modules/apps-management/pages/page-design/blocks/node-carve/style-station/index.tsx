import React, { useEffect, useMemo, useRef, useState } from 'react';
import cs from 'classnames';
import { get } from 'lodash';
import { observer } from 'mobx-react';

import { Tab } from '@one-for-all/ui';

import StyleMirror from './style-mirror';
import CssEditor from './code-editor';
import { useConfigContext } from '../context';
import { updateNodeProperty } from '../utils';
import { cssStringToJsonObj, jsonObjToFormattedCssString } from './utils';

import './index.scss';
import { Radio, RadioChangeEvent } from 'antd';

import styleStore from './style-mirror/store';

const STYLE_TYPE: LabelValue[] = [
  {
    label: '整体样式',
    value: 'style',
  },
  {
    label: 'item样式',
    value: 'itemStyle',
  },
];

function StyleStation(): JSX.Element {
  const editorRef = useRef<any>(null);
  const [currentPanel, setCurrentPanel] = useState<string>('style-mirror');
  const { artery, rawActiveNode, onArteryChange } = useConfigContext() ?? {};
  const curElemStyles = useMemo(() =>get(rawActiveNode,
    `props.${styleStore.styleType}.value`, {}),
  [artery, styleStore.styleType] );

  function handleCssEditorStyleChange(value?: string): void {
    const styleObj = cssStringToJsonObj(value);
    if (!styleObj) return;
    if (rawActiveNode && artery) {
      const newArtery = updateNodeProperty(
        rawActiveNode,
        `props.${styleStore.styleType}`,
        { type: 'constant_property', value: styleObj },
        artery,
      );
      onArteryChange?.(newArtery);
    }
  }

  function handleStyleTypeChange(e: RadioChangeEvent): void {
    const { value } = e.target;
    styleStore.setStyleType(value);
  }

  function handleEditorDidMount(editor: any): void {
    editorRef.current = editor;
  }

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.setValue(
      jsonObjToFormattedCssString(curElemStyles, `component-${rawActiveNode?.id}-item` || 'unknown-component-item'),
    );
  }, [styleStore.styleType]);

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
          onMount={handleEditorDidMount}
        />
      ),
    },
  ];

  return (
    <div className={cs('style-station')}>
      <Radio.Group
        className='py-10 flex justify-evenly'
        options={STYLE_TYPE}
        onChange={handleStyleTypeChange}
        value={styleStore.styleType}
      />
      <Tab
        style={{ height: 'calc(100% - 42px)' }}
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

export default observer(StyleStation);

