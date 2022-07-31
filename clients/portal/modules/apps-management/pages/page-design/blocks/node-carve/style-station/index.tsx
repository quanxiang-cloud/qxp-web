import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import cs from 'classnames';
import { get } from 'lodash';
import { observer } from 'mobx-react';

import { Select, Tab } from '@one-for-all/ui';

import StyleMirror from './style-mirror';
import CssEditor from './code-editor';
import { useConfigContext } from '../context';
import { updateNodeProperty } from '../utils';
import { cssStringToJsonObj, jsonObjToFormattedCssString } from './utils';

import './index.scss';

import styleStore from './style-mirror/store';
import FountainContext from '../../../fountain-context';
import { BasePropSpec } from '@one-for-all/node-carve';

const DEFAULT_STYLE_TYPE: LabelValue[] = [
  {
    label: '组件整体样式',
    value: 'style',
  },
];

function StyleStation(): JSX.Element {
  const editorRef = useRef<any>(null);
  const [currentPanel, setCurrentPanel] = useState<string>('style-mirror');
  const { artery, rawActiveNode, onArteryChange, activeNode } = useConfigContext() ?? {};
  const { getNodePropsSpec } = useContext(FountainContext);
  const styleSpec = useMemo(() => {
    if (!activeNode || (activeNode.type !== 'react-component' && activeNode.type !== 'html-element')) {
      return [];
    }

    const specs: BasePropSpec[] = getNodePropsSpec(activeNode)?.props || [];
    const customStyleType = specs.filter((item) => item.will === 'StyleSheet').map((item) => ({
      label: item.label,
      value: item.name,
    }));
    return DEFAULT_STYLE_TYPE.concat(customStyleType);
  }, [activeNode, styleStore.styleType]);

  const curElemStyles = useMemo(() =>get(rawActiveNode,
    `props.${styleStore.styleType}.value`, {}),
  [artery, styleStore.styleType, activeNode] );

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

  function handleStyleTypeChange(value: string): void {
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
  }, [styleStore.styleType, activeNode]);

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
      <div className='px-10 py-5'
      >
        <Select
          defaultValue='style'
          options={styleSpec}
          onChange={handleStyleTypeChange}
          value={styleStore.styleType}
        />
      </div>

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

