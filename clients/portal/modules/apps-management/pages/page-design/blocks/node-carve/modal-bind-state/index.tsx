import React, { useMemo, useRef, useState } from 'react';
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
  const [stateExpr, setStateExpr] = useState(''); // 绑定变量的表达式
  const [fallback, setFallBack] = useState<boolean>();
  // const [convertorExpr, setConvertorExpr] = useState('state'); // 绑定变量的convertor表达式
  // const isLoopNode = rawActiveNode?.type === 'loop-container';
  const sharedStates = Object.entries(dataSource.sharedState).map(([_, value]) => JSON.parse(value));
  const apiStates = Object.entries(dataSource.apiState).map(([_, value]) => JSON.parse(value));
  const names = useMemo(() => bindVariables.map(({ depID }) => depID), [bindVariables]);
  const editorRef = useRef<EditorRefType>();

  function onCancel(): void {
    setModalBindStateOpen(false);
  }

  function handleBind(): void {
    if (!updateAttrPayload) {
      return;
    }

    if (!stateExpr) {
      toast.error('变量表达式不能为空');
      return;
    }

    // if (!convertorExpr) {
    //   toast.error('变量转换函数不能为空');
    //   return;
    // }

    const finalStateExpr = stateExpr.split(' ').map((value) => {
      const _value = names.includes(value) ? `states['${value}']` : value;
      return _value;
    }).join(' ');

    // need to confirm the stateExpr with variable join and operator
    const match = finalStateExpr.match(/states\['(.+)'\]/i);
    if (!match || !match[1]) {
      toast.error(`无效的 stateID: ${stateExpr}`);
      return;
    }

    const computedProperty: ComputedProperty = {
      type: 'computed_property',
      deps: bindVariables,
      fallback: fallback,
      convertor: {
        type: 'state_convert_expression',
        expression: finalStateExpr,
      },
    };

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
                    editorRef.current?.onInsertText(`${name} `);

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
          <Section title="API变量" defaultExpand>
            {apiStates.map(({ name, val, desc }) => {
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
        </div>
        <div className={styles.body}>
          <div>已绑定变量：</div>
          {!bindVariables.length && <div className='px-8 py-4 border-1 text-center'>请点击左侧可用变量列表进行变量绑定操作</div>}
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
            <div>逻辑运算符：</div>
            <div className='grid gap-4 grid-cols-4'>
              {LOGIC_OPERATOR.map((op) => {
                return (
                  <div
                    key={op}
                    onClick={() => editorRef.current?.onInsertText(`${op} `)}
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
            items={[
              {
                id: 'expression',
                name: '变量表达式',
                content: <CodeEditor
                  ref={editorRef}
                  value={stateExpr}
                  onChange={setStateExpr}
                />,
              },
              // {
              //   id: 'convertor',
              //   name: '自定义函数',
              //   content: <CodeEditor
              //     ref={editorRef}
              //     value={convertorExpr}
              //     onChange={(value) => console.log(value)}
              //   />,
              // },
            ]}
          />
          <div className='flex items-center'>
            <span>默认渲染：</span>
            <Toggle onChange={setFallBack} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalBindState;
