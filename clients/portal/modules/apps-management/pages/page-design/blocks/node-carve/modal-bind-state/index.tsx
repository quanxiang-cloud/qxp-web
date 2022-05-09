import React, { useEffect, useMemo, useRef, useState } from 'react';
import { get } from 'lodash';
import { Modal, toast } from '@one-for-all/ui';
import { ComputedProperty, ComputedDependency } from '@one-for-all/artery';

import Tab from '@c/tab';
import Toggle from '@c/toggle';
import { useCtx } from '@pageDesign/ctx';

import Section from '../../../utils/section';
import CodeEditor, { EditorRefType } from './code-editor';
import { ConfigContextState, useConfigContext } from '../context';

import styles from './index.m.scss';
import { updateNodeProperty } from '../utils';
import { findNode } from '../utils/tree';

const LOGIC_OPERATOR = ['&&', '||', '()', '!', '===', '!=='];

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
  const [expressionStr, setExpressionStr] = useState(''); //
  const [convertorStr, setConvertorStr] = useState(''); //
  const [editorType, setEditorType] = useState<'expression' | 'convertor'>('expression');
  const expressionEditorRef = useRef<EditorRefType>();
  const convertorEditorRef = useRef<EditorRefType>();
  const [fallback, setFallBack] = useState<boolean>();
  const sharedStates = Object.entries(dataSource.sharedState).map(([_, value]) => JSON.parse(value));
  const apiStates = Object.entries(dataSource.apiState).map(([_, value]) => JSON.parse(value));
  const names = useMemo(() => bindVariables.map(({ depID }) => depID), [bindVariables]);

  function onCancel(): void {
    setModalBindStateOpen(false);
  }

  function handleBind(): void {
    if (!updateAttrPayload) {
      return;
    }

    let computedProperty: ComputedProperty = {
      type: 'computed_property',
      deps: bindVariables,
      fallback: fallback,
      convertor: {
        type: 'state_convert_expression',
        expression: '',
      },
    };

    if (editorType === 'expression') {
      if (!expressionStr) {
        toast.error('变量表达式不能为空');
        return;
      }

      const finalStateExpr = expressionStr.split(' ').map((value) => {
        // value maybe has symbol of '.' or '[]'
        const variable = value.split('.')[0]?.split('[')[0] || '';
        const _value = names.includes(variable) ? value.replace(variable, `states['${variable}']`) : value;

        return _value;
      }).join(' ');

      // need to confirm the stateExpr with variable join and operator
      const match = finalStateExpr.match(/states\['(.+)'\]/i);
      if (!match || !match[1]) {
        toast.error(`无效的表达式: ${expressionStr}`);
        return;
      }

      computedProperty = {
        ...computedProperty,
        convertor: {
          type: 'state_convert_expression',
          expression: finalStateExpr,
        },
      };
    }

    if (editorType === 'convertor') {
      if (!convertorStr) {
        toast.error('自定义 convertor 函数内容不能为空');
        return;
      }

      // need to confirm the body
      // const match = convertorStr.match(/return \['( +)'\]/i);
      // if (!match || !match[1]) {
      //   toast.error('无效的自定义 convertor 函数');
      //   return;
      // }

      computedProperty = {
        ...computedProperty,
        convertor: {
          type: 'state_convertor_func_spec',
          args: 'state',
          body: convertorStr,
        },
      };
    }

    if (updateAttrPayload.type === 'loopNode') {
      // to get looNode property
    } else {
      activeNode &&
        onArteryChange(
          updateNodeProperty(
            activeNode,
            updateAttrPayload.path,
            computedProperty,
            artery,
          ),
        );
    }
    setModalBindStateOpen(false);
  }

  useEffect(() => {
    if (!updateAttrPayload) {
      return;
    }

    const node = findNode(artery.node, activeNode?.id);
    const bindConf = get(node, updateAttrPayload.path);

    if (!bindConf) return;

    setFallBack(bindConf.fallback);
    setBindVariables(bindConf.deps);

    if (bindConf.convertor.type === 'state_convert_expression') {
      const expr = bindConf.convertor?.expression;
      const _expr = expr.split(' ').map((value: string) => {
        if (!LOGIC_OPERATOR.includes(value)) {
          if (!value) {
            return;
          }
          // to get variable
          const variableExp = value.split('.')[0].split(']')[0] + ']';

          return value.replace(variableExp, variableExp.split('\'')[1]);
        }

        return value;
      }).join(' ');

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
  }, [activeNode?.id]);

  useEffect(() => {
    const sharedStatesSpec = {
      a: { initial: '{"name":"a","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
      b: { initial: '{"name":"b","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
      c: { initial: '{"name":"c","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
      d: { initial: '{"name":"d","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
      e: { initial: '{"name":"e","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
      f: { initial: '{"name":"f","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
      g: { initial: '{"name":"g","val":"{\\"key1\\":\\"val1\\"}","desc":""}' },
    };

    onArteryChange({ ...artery, sharedStatesSpec });
  }, []);

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
        </div>
        <div className={styles.body}>
          <div className='py-4'>已绑定变量：</div>
          {!bindVariables.length && <div className='px-8 py-4 border-1 text-center'>请先点击左侧可用变量列表进行变量绑定操作</div>}
          {!!bindVariables.length && (
            <div className='grid gap-4 grid-cols-4'>
              {bindVariables.map(({ depID, type }) => {
                return (
                  <div
                    key={`${depID}_${type}`}
                    className='px-8 py-4 border-1 inline-block text-center cursor-pointer hover:bg-blue-400'
                  >
                    {depID}
                  </div>
                );
              })}
            </div>
          )}
          {updateAttrPayload?.path === 'shouldRender' && (<>
            <div className='py-4'>逻辑运算符：</div>
            <div className='grid gap-4 grid-cols-4'>
              {LOGIC_OPERATOR.map((op) => {
                return (
                  <div
                    key={op}
                    onClick={() => expressionEditorRef.current?.onInsertText(`${op} `)}
                    className='px-8 py-4 border-1 inline-block text-center cursor-pointer hover:bg-blue-400'
                  >
                    {op}
                  </div>
                );
              })}
            </div>
          </>)}
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
                  <div className='pb-4'>表达式如果书写错误，保存后控制台会报错</div>
                  <CodeEditor
                    ref={expressionEditorRef}
                    value={expressionStr}
                    type="expression"
                    onChange={(value) => {
                      console.log('expressionValue', value);
                      setExpressionStr(value);
                    }}
                  />
                </>,
              },
              {
                id: 'convertor',
                name: '自定义函数',
                content:
                <>
                  <div className='pb-4'>应该保证函数有返回值</div>
                  <CodeEditor
                    ref={convertorEditorRef}
                    value={convertorStr}
                    type="convertor"
                    onChange={(value) => {
                      console.log('convertorValue', value);
                      setConvertorStr(value);
                    }}
                  />
                </>,
              },
            ]}
          />
          {updateAttrPayload?.path === 'shouldRender' && (
            <div className='flex items-center'>
              <span>默认渲染：</span>
              <Toggle defaultChecked={fallback} onChange={setFallBack} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalBindState;
