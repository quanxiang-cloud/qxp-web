import React, { useEffect, useMemo, useRef, useState } from 'react';
import { get } from 'lodash';
import { Modal, toast } from '@one-for-all/ui';
import { ComputedProperty, ComputedDependency } from '@one-for-all/artery';

import Tab from '@c/tab';
import Toggle from '@c/toggle';
import { useCtx } from '@pageDesign/ctx';

import { findNode } from '../utils/tree';
import Section from '../../../utils/section';
import { updateNodeProperty } from '../utils';
import CodeEditor, { EditorRefType } from './code-editor';
import { LOGIC_OPERATOR, SHARED_STATES_SPEC } from './constants';
import { ConfigContextState, UpdateAttrPayloadType, useConfigContext } from '../context';
import { confirmExpressionStr, parseToExpression, parseToExpressionStr } from './utils';

import styles from './index.m.scss';

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
  const [convertorStr, setConvertorStr] = useState(''); // convertor函数内容
  const [editorType, setEditorType] = useState<'expression' | 'convertor'>('expression');
  const expressionEditorRef = useRef<EditorRefType>();
  const convertorEditorRef = useRef<EditorRefType>();
  const [fallback, setFallBack] = useState<boolean>();
  const sharedStates = Object.entries(dataSource.sharedState).map(([_, value]) => JSON.parse(value));
  const apiStates = Object.entries(dataSource.apiState).map(([_, value]) => JSON.parse(value));
  const names = useMemo(() => bindVariables.map(({ depID }) => depID), [bindVariables]);

  function VariableList() {
    return (
      <>
        <Section title="自定义变量" defaultExpand>
          {sharedStates.map(({ name }) => {
            return (
              <div
                key={name}
                onClick={() => {
                  expressionEditorRef.current?.onInsertText(`${name} `);

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
        {!!apiStates.length && (
          <Section title="API变量" defaultExpand>
            {apiStates.map(({ name }) => {
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
                  onClick={() => expressionEditorRef.current?.onInsertText(depID)}
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
                    onClick={() => expressionEditorRef.current?.onInsertText(`${op} `)}
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

  function handleBind(): void {
    if (!updateAttrPayload) {
      return;
    }

    const defaultProperty: ComputedProperty = {
      type: 'computed_property',
      deps: bindVariables,
      fallback: fallback,
      convertor: {
        type: 'state_convert_expression',
        expression: expressionStr,
      },
    };

    if (convertorStr) {
      // need to confirm the body
      // const match = convertorStr.match(/return \['( +)'\]/i);
      // if (!match || !match[1]) {
      //   toast.error('无效的自定义 convertor 函数');
      //   return;
      // }

      return bindSubmit(updateAttrPayload, {
        ...defaultProperty,
        convertor: {
          type: 'state_convertor_func_spec',
          args: 'state',
          body: convertorStr,
        },
      });
    }

    if (expressionStr) {
      const finalStateExpr = parseToExpression(expressionStr, names);
      // need to confirm the stateExpr with variable join and operator
      if (!confirmExpressionStr(finalStateExpr)) return;

      console.log(finalStateExpr);

      return bindSubmit(updateAttrPayload, {
        ...defaultProperty,
        convertor: {
          type: 'state_convert_expression',
          expression: finalStateExpr,
        },
      });
    }

    return toast.error('变量表达式和自定义 convertor 函数不能都为空');
  }

  function initValueByBindConf(bindConf: any): void {
    setFallBack(bindConf.fallback);
    setBindVariables(bindConf.deps);

    if (bindConf.convertor.type === 'state_convert_expression') {
      const expr = bindConf.convertor?.expression;
      const _expr = parseToExpressionStr(expr);

      setEditorType('expression');
      expressionEditorRef.current?.onInsertText(expr);
      setExpressionStr(_expr);
      setConvertorStr('');
    }

    if (bindConf.convertor.type === 'state_convertor_func_spec') {
      const body = bindConf.convertor?.body;

      setEditorType('convertor');
      convertorEditorRef.current?.onInsertText(body);
      setConvertorStr(body);
      setExpressionStr('');
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
                content:
                <>
                  <div className="pb-12 text-blue-400 text-12">配置表达式前，应清空自定义函数，保存的表达式才能生效</div>
                  <CodeEditor
                    type="expression"
                    ref={expressionEditorRef}
                    value={expressionStr}
                    onChange={setExpressionStr}
                  />
                </>,
              },
              {
                id: 'convertor',
                name: '自定义函数',
                content:
                <>
                  <div className="pb-12 text-blue-400 text-12">配置表达式前，应先清空自定义函数，保存的表达式才能生效</div>
                  <CodeEditor
                    type="convertor"
                    ref={convertorEditorRef}
                    value={convertorStr}
                    onChange={setConvertorStr}
                  />
                </>,
              },
            ]}
          />
          {updateAttrPayload?.path === 'shouldRender' && (
            <div className="flex items-center">
              <span>默认渲染：</span>
              <Toggle defaultChecked={fallback} onChange={setFallBack} />
            </div>
          )}
          <div className="text-12 text-gray-400">表达式或自定义 convertor 函数因某种原因执行失败或者出现异常的时候，作为执行结果的默认值</div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalBindState;
