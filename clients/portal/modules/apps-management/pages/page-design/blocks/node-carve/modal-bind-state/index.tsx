import React, { useEffect, useMemo, useRef, useState } from 'react';
import { get } from 'lodash';
import { Modal } from '@one-for-all/ui';
import { ComputedProperty, ComputedDependency } from '@one-for-all/artery';

import Tab from '@c/tab';
import Toggle from '@c/toggle';
import toast from '@lib/toast';

import { updateNodeProperty, findNode } from '../utils';
import CodeEditor, { EditorRefType } from './code-editor';
import LogicOperatorsAndBoundVariables from './bound-and-logic';
import { ConfigContextState, UpdateAttrPayloadType, useConfigContext } from '../context';
import { getFnBody, parseAst, parseToExpressionStr, toConvertorProp } from './utils';

import styles from './index.m.scss';
import VariableList from './variable-list';

export type VariableBindConf = {
  type: 'convertor' | 'expression';
  contentStr: string;
}

const titleMap: Record<string, string> = {
  shouldRender: '条件渲染配置',
  'loop-node': '循环渲染规则配置',
};

function ModalBindState(): JSX.Element | null {
  const {
    activeNode,
    rawActiveNode,
    artery,
    onArteryChange,
    setModalBindStateOpen,
    updateAttrPayload,
  } = useConfigContext() as ConfigContextState;
  const isShouldRenderConfig = updateAttrPayload?.path === 'shouldRender';
  const isLoopRenderConfig = updateAttrPayload?.path === 'loop-node';
  const [boundVariables, setBoundVariables] = useState<ComputedDependency[]>([]); // 已绑定的变量
  const [fallback, setFallBack] = useState<boolean>(); // 默认值
  const [expressionStr, setExpressionStr] = useState(''); // 表达式
  const [convertorStr, setConvertorStr] = useState(''); // 自定义函数内容
  const [toPropsStr, setToPropsStr] = useState(''); // 循环渲染转换函数内容
  const [editorType, setEditorType] = useState<'expression' | 'convertor' | 'toProps'>(isLoopRenderConfig ? 'toProps' : 'expression'); // 最终保存的配置内容的类型 '表达式' | '自定义函数'
  const editorRef = useRef<EditorRefType>();
  const expressionEditorRef = useMemo(() => {
    return editorType === 'expression' ? editorRef : undefined;
  }, [editorType]);
  const finalConfig: VariableBindConf = useMemo(() => {
    if (convertorStr) {
      return { type: 'convertor', contentStr: convertorStr };
    }

    return { type: 'expression', contentStr: expressionStr };
  }, [expressionStr, convertorStr]);

  function onCancel(): void {
    setModalBindStateOpen(false);
  }

  function handleUnbind(depID: string): void {
    setBoundVariables(boundVariables.filter(({ depID: id }) => id !== depID));
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
      const bodyString = getFnBody(parseAst(val), val);

      return setConvertorStr(bodyString);
    }

    setExpressionStr(val);
  }

  function handleBind(): void {
    if (!updateAttrPayload) {
      return;
    }

    if (!expressionStr && !convertorStr) {
      return toast.error('表达式和自定义函数的内容，不能都为空！');
    }

    const computedProperty: ComputedProperty = {
      type: 'computed_property',
      deps: boundVariables,
      fallback: fallback,
      convertor: toConvertorProp(finalConfig),
    };

    return bindSubmit(updateAttrPayload, computedProperty);
  }

  function initValueByBindConf(bindConf: any): void {
    setFallBack(bindConf.fallback);
    setBoundVariables(bindConf.deps);

    if (bindConf?.convertor?.type === 'state_convert_expression') {
      const expr = bindConf.convertor?.expression;
      const _expr = parseToExpressionStr(expr);

      setEditorType('expression');
      editorRef.current?.onInsertText(expr);
      setExpressionStr(_expr);
    }

    if (bindConf?.convertor?.type === 'state_convertor_func_spec') {
      setEditorType('convertor');
      setConvertorStr(bindConf.convertor?.body);
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

  return (
    <Modal
      title={titleMap[`${updateAttrPayload?.path}`] ?? '变量绑定'}
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
          <VariableList
            boundVariables={boundVariables}
            updateBoundVariables={setBoundVariables}
            editorRef={expressionEditorRef}
          />
        </div>
        <div className={styles.body}>
          {!isLoopRenderConfig && (
            <>
              <LogicOperatorsAndBoundVariables
                boundVariables={boundVariables}
                unBind={handleUnbind}
                editorRef={expressionEditorRef}
              />
              <Tab
                style={{ height: 'auto' }}
                currentKey={editorType}
                onChange={(id) => id === 'convertor' ? setEditorType('convertor') : setEditorType('expression')}
                items={[
                  {
                    id: 'expression',
                    name: isShouldRenderConfig ? '条件表达式' : '变量表达式',
                    content: <div className={styles.tip}>配置前，应清空自定义函数，保存的表达式才能生效</div>,
                  },
                  {
                    id: 'convertor',
                    name: '自定义函数',
                    content: <div className={styles.tip}>配置自定义函数</div>,
                  },
                ]}
              />
            </>
          )}
          <CodeEditor
            type={editorType}
            ref={editorRef}
            initValue={editorType === 'convertor' ? convertorStr : expressionStr}
            onChange={handleEditorChange}
          />
          <div className="flex items-center pt-12">
            <span>默认值：</span>
            <Toggle defaultChecked={fallback} onChange={setFallBack} />
          </div>
          <div className={styles.desc}>表达式或自定义函数因某种原因执行失败或者出现异常的时候，将使用该默认值</div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalBindState;
