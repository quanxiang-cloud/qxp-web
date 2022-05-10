import React, { useEffect, useMemo, useRef, useState } from 'react';
import { get } from 'lodash';
import { Modal } from '@one-for-all/ui';
import { ComputedProperty, ComputedDependency } from '@one-for-all/artery';

import Tab from '@c/tab';
import Toggle from '@c/toggle';
import { useCtx } from '@pageDesign/ctx';

import { findNode } from '../utils/tree';
import Section from '../../../utils/section';
import { updateNodeProperty } from '../utils';
import CodeEditor, { EditorRefType } from './code-editor';
import { LOGIC_OPERATOR, SHARED_STATES_SPEC } from './constants';
import { generateInitFunString, parseToExpressionStr, toConvertorProp } from './utils';
import { ConfigContextState, UpdateAttrPayloadType, useConfigContext } from '../context';

import styles from './index.m.scss';
import toast from '@lib/toast';

type VariableListProps = {
  sharedStates?: any[],
  apiStates?: any[],
}

export type VariableBindConf = {
  type: 'convertor' | 'expression';
  contentStr: string;
}

function ModalBindState(): JSX.Element | null {
  const { dataSource } = useCtx();
  const {
    activeNode,
    rawActiveNode,
    artery,
    onArteryChange,
    setModalBindStateOpen,
    updateAttrPayload,
  } = useConfigContext() as ConfigContextState;
  const [bindVariables, setBindVariables] = useState<ComputedDependency[]>([]); // 已绑定的变量
  const [expressionStr, setExpressionStr] = useState(''); // 表达式
  const [convertorStr, setConvertorStr] = useState(
    generateInitFunString({ name: 'shouldRender', args: 'states' }),
  ); // convertor函数内容
  const [editorType, setEditorType] = useState<'expression' | 'convertor'>('expression'); // 最终保存的配置内容的类型 '表达式' | '自定义函数'
  const editorRef = useRef<EditorRefType>();
  const [fallback, setFallBack] = useState<boolean>();
  const names = useMemo(() => bindVariables.map(({ depID }) => depID), [bindVariables]);
  const finalConfig: VariableBindConf = useMemo(() => {
    if (convertorStr) {
      return { type: 'convertor', contentStr: convertorStr };
    }

    return { type: 'expression', contentStr: expressionStr };
  }, [expressionStr, convertorStr]);

  function VariableList({ sharedStates, apiStates }: VariableListProps) {
    const _sharedStates = Object.entries(dataSource.sharedState).map(([_, value]) => JSON.parse(value));
    const _apiStates = Object.entries(dataSource.apiState).map(([_, value]) => JSON.parse(value));

    return (
      <>
        <Section title="自定义变量" defaultExpand>
          {_sharedStates.map(({ name }) => {
            return (
              <div
                key={name}
                onClick={() => {
                  editorType === 'expression' && editorRef.current?.onInsertText(`${name} `);

                  if (names.includes(name)) return;
                  setBindVariables([...bindVariables, { depID: name, type: 'shared_state' }]);
                }}
                className='cursor-pointer hover:bg-blue-400'
              >
                {name}
              </div>
            );
          })}
        </Section>
        {!!_apiStates.length && (
          <Section title="API变量" defaultExpand>
            {_apiStates.map(({ name }) => {
              return (
                <div
                  key={name}
                  onClick={() => console.log('bind: ', name, 'api_state')}
                  className='cursor-pointer hover:bg-blue-400'
                >
                  {name}
                </div>
              );
            })}
          </Section>
        )}
      </>
    );
  }

  function SupportedVariablesAndOperators() {
    return (
      <>
        <div className="py-4">已绑定变量：</div>
        {!bindVariables.length && <div className="px-8 py-4 border-1 text-center">请先点击左侧可用变量列表进行变量绑定操作</div>}
        {!!bindVariables.length && (
          <div className="grid gap-4 grid-cols-4">
            {bindVariables.map(({ depID, type }) => {
              return (
                <div
                  key={`${depID}_${type}`}
                  onClick={() => editorType === 'expression' && editorRef.current?.onInsertText(depID)}
                  className="px-8 py-4 border-1 inline-block text-center cursor-pointer hover:bg-blue-400 relative"
                >
                  {depID}
                  {/* <Icon className="absolute r-0 t-0" name="close" /> */}
                </div>
              );
            })}
          </div>
        )}
        {updateAttrPayload?.path === 'shouldRender' && (
          <>
            <div className="py-4">逻辑运算符：</div>
            <div className="grid gap-4 grid-cols-4">
              {LOGIC_OPERATOR.map((op) => {
                return (
                  <div
                    key={op}
                    onClick={() => editorType === 'expression' && editorRef.current?.onInsertText(`${op} `)}
                    className="px-8 py-4 border-1 inline-block text-center cursor-pointer hover:bg-blue-400"
                  >
                    {op}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </>
    );
  }

  function onCancel(): void {
    setModalBindStateOpen(false);
  }

  function bindSubmit(node: UpdateAttrPayloadType, property: ComputedProperty): void {
    if (node.type === 'loopNode') {
      // to get looNode property
      return onCancel();
    }

    activeNode && onArteryChange(updateNodeProperty(activeNode, node.path, property, artery));
    onCancel();
  }

  function handleEditorChange(val: string): void {
    if (editorType === 'convertor') {
      return setConvertorStr(val);
    }

    setExpressionStr(val);
  }

  function handleBind(): void {
    if (!updateAttrPayload) {
      return;
    }

    if (!expressionStr && !convertorStr) {
      return toast.error('表达式和 convertor 自定义函数，不能都为空！');
    }

    const computedProperty: ComputedProperty = {
      type: 'computed_property',
      deps: bindVariables,
      fallback: fallback,
      convertor: toConvertorProp(finalConfig),
    };

    return bindSubmit(updateAttrPayload, computedProperty);
  }

  function initValueByBindConf(bindConf: any): void {
    setFallBack(bindConf.fallback);
    setBindVariables(bindConf.deps);

    if (bindConf.convertor.type === 'state_convert_expression') {
      const expr = bindConf.convertor?.expression;
      const _expr = parseToExpressionStr(expr);

      setEditorType('expression');
      editorRef.current?.onInsertText(expr);
      setExpressionStr(_expr);
    }

    if (bindConf.convertor.type === 'state_convertor_func_spec') {
      const body = generateInitFunString({
        name: 'shouldRender',
        args: 'states',
        body: bindConf.convertor?.body,
      });

      setEditorType('convertor');
      editorRef.current?.onInsertText(body);
      setConvertorStr(body);
    }
  }

  useEffect(() => {
    if (!updateAttrPayload) {
      return;
    }

    const node = findNode(artery.node, activeNode?.id);
    const bindConf = get(node, updateAttrPayload.path);

    if (!bindConf) return;

    initValueByBindConf(bindConf);
  }, [activeNode?.id]);

  // to mock shareStatesSpec
  useEffect(() => onArteryChange({ ...artery, sharedStatesSpec: SHARED_STATES_SPEC }), []);

  return (
    <Modal
      title={updateAttrPayload?.path === 'shouldRender' ? '条件渲染配置' : '变量绑定'}
      className='py-8'
      onClose={onCancel}
      footerBtns={[
        {
          key: 'close',
          iconName: 'close',
          onClick: onCancel,
          text: '取消',
        },
        {
          key: 'check',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleBind,
          text: '确定',
        },
      ]}
    >
      <div className={styles.modal}>
        <div className={styles.side}>
          <VariableList />
        </div>
        <div className={styles.body}>
          <SupportedVariablesAndOperators />
          <Tab
            style={{ height: 'auto' }}
            currentKey={editorType}
            onChange={(id) => id === 'convertor' ? setEditorType('convertor') : setEditorType('expression')}
            items={[
              {
                id: 'expression',
                name: updateAttrPayload?.path === 'shouldRender' ? '条件表达式' : '变量表达式',
                content: <div className="text-blue-400 text-12">配置前，应清空自定义函数，保存的表达式才能生效</div>,
              },
              {
                id: 'convertor',
                name: '自定义函数',
                content: <div className="text-blue-400 text-12">配置自定义函数</div>,
              },
            ]}
          />
          <CodeEditor
            type={editorType}
            ref={editorRef}
            initValue={editorType === 'convertor' ? convertorStr : expressionStr}
            onChange={handleEditorChange}
          />
          {updateAttrPayload?.path === 'shouldRender' && (
            <div className="flex items-center pt-12">
              <span>默认渲染：</span>
              <Toggle defaultChecked={fallback} onChange={setFallBack} />
            </div>
          )}
          <div className="text-12 text-gray-400 pt-4">表达式或自定义 convertor 函数因某种原因执行失败或者出现异常的时候，作为执行结果的默认值</div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalBindState;
