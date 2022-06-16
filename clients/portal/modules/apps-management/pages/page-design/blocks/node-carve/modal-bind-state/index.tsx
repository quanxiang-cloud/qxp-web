import React, { useEffect, useMemo, useRef, useState } from 'react';
import { get } from 'lodash';
import { Modal } from '@one-for-all/ui';
import { ComputedProperty, ComputedDependency, NodeProperty } from '@one-for-all/artery';

import Tab from '@c/tab';
import Toggle from '@c/toggle';
import toast from '@lib/toast';

import { updateNodeProperty, findNode, updateCurNodeAsLoopContainer } from '../utils';
import CodeEditor, { EditorRefType } from './code-editor';
import LogicOperatorsAndBoundVariables from './bound-and-logic';
import { ConfigContextState, UpdateAttrPayloadType, useConfigContext } from '../context';
import { getFnBody, parseAst, parseToExpression, parseToExpressionStr, toConvertorProp } from './utils';

import styles from './index.m.scss';
import VariableList from './variable-list';

export type VariableBindConf = {
  type: 'convertor' | 'expression';
  contentStr: string;
}

export type FuncType = 'expression' | 'convertor' | 'toProps';

const titleMap: Record<string, string> = {
  shouldRender: '条件渲染配置',
  'loop-node': '循环渲染规则配置',
};

const stateTypeMap: Record<string, 'shared_state_property' | 'api_result_property'> = {
  shared_state: 'shared_state_property',
  api_state: 'api_result_property',
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
  const [fallback, setFallBack] = useState<unknown>(); // 默认值
  const [expressionStr, setExpressionStr] = useState(''); // 表达式
  const [convertorStr, setConvertorStr] = useState(''); // 自定义函数内容
  const [toPropsStr, setToPropsStr] = useState(''); // 循环渲染转换函数内容
  const [editorType, setEditorType] = useState<FuncType>(isLoopRenderConfig ? 'toProps' : 'expression'); // 最终保存的配置内容的类型 '表达式' | '自定义函数'
  const editorRef = useRef<EditorRefType>();
  const expressionEditorRef = useMemo(() => {
    return editorType === 'expression' ? editorRef : undefined;
  }, [editorType]);
  const finalConfig: VariableBindConf = useMemo(() => {
    if (convertorStr) {
      return { type: 'convertor', contentStr: convertorStr };
    }

    return {
      type: 'expression',
      contentStr: parseToExpression(expressionStr, boundVariables.map(({ depID }) => depID)),
    };
  }, [expressionStr, convertorStr]);

  function onCancel(): void {
    setModalBindStateOpen(false);
  }

  function handleUnbind(depID: string): void {
    setBoundVariables(boundVariables.filter(({ depID: id }) => id !== depID));
  }

  function bindSubmit(node: UpdateAttrPayloadType, property: ComputedProperty | NodeProperty): void {
    if (node.type === 'loopNode') {
      rawActiveNode && onArteryChange(
        updateCurNodeAsLoopContainer(
          rawActiveNode,
          'iterableState',
          property,
          artery,
          toPropsStr,
        ),
      );
      return onCancel();
    }

    activeNode && onArteryChange(updateNodeProperty(activeNode, node.path, property, artery));
    onCancel();
  }

  function handleEditorChange(val: string): void {
    if (editorType === 'toProps') {
      const bodyString = getFnBody(parseAst(val), val);
      return setToPropsStr(bodyString);
    }

    if (editorType === 'convertor') {
      const bodyString = getFnBody(parseAst(val), val);
      return setConvertorStr(bodyString);
    }

    setExpressionStr(val);
  }

  function updateFallBack(val: boolean): void {
    if (!val) return setFallBack(undefined);
    isShouldRenderConfig && setFallBack(true);
    isLoopRenderConfig && setFallBack([]);
  }

  function handleBind(): void {
    if (!updateAttrPayload) {
      return;
    }

    if (!boundVariables.length) {
      return toast.error('请绑定变量！');
    }

    if (editorType === 'toProps' ) {
      if (!toPropsStr) {
        return toast.error('循环渲染的映射函数内容不能为空！');
      }

      const bindState = boundVariables.pop();
      const iterableState: NodeProperty = {
        type: stateTypeMap[`${bindState?.type}`],
        stateID: bindState?.depID ?? '',
        fallback: '',
      };

      return bindSubmit(updateAttrPayload, iterableState);
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
    if (bindConf.iterableState) {
      const state = bindConf.iterableState;
      setBoundVariables([
        {
          depID: state.stateID,
          type: state.type === 'shared_state_property' ? 'shared_state' : 'api_state',
        },
      ]);
    } else {
      setBoundVariables(bindConf.deps);
    }

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

    if (bindConf.toProps) {
      setEditorType('toProps');
      setToPropsStr(bindConf.toProps?.body);
    }
  }

  function initCodeEditor(): string {
    if (editorType === 'toProps') {
      return toPropsStr;
    }
    if (editorType === 'convertor') {
      return convertorStr;
    }
    return expressionStr;
  }

  useEffect(() => {
    if (!updateAttrPayload) {
      return;
    }

    const node = findNode(
      artery.node,
      updateAttrPayload.path === 'loop-node' ? rawActiveNode?.id : activeNode?.id,
    );

    let bindConf = get(node, updateAttrPayload.path);
    if (updateAttrPayload.path === 'loop-node') {
      const iterableState = get(node, 'iterableState');
      const toProps = get(node, 'toProps');
      if (!iterableState || !toProps) return;
      bindConf = { iterableState, toProps };
    }

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
            singleBind={isLoopRenderConfig}
          />
        </div>
        <div className={styles.body}>
          <LogicOperatorsAndBoundVariables
            boundVariables={boundVariables}
            unBind={handleUnbind}
            editorRef={expressionEditorRef}
            hideOperator={isLoopRenderConfig}
          />
          <Tab
            style={{ height: 'auto' }}
            currentKey={editorType}
            onChange={setEditorType}
            items={isLoopRenderConfig ? [
              {
                id: 'toProps',
                name: '变量映射函数',
                content: <div className={styles.tip}>将当前已绑定的可循环的数据源映射到组件属性</div>,
              },
            ] : [
              {
                id: 'expression',
                name: isShouldRenderConfig ? '条件表达式' : '变量表达式',
                content: <div className={styles.tip}>配置前，应清空自定义函数，保存的表达式才能生效</div>,
              },
              {
                id: 'convertor',
                name: '自定义函数',
                content: <div className={styles.tip}>配置自定义函数，处理已绑定的变量</div>,
              },
            ]}
          />
          <CodeEditor
            type={editorType}
            ref={editorRef}
            updateAttrPayloadPath={updateAttrPayload?.path}
            initValue={initCodeEditor()}
            onChange={handleEditorChange}
          />
          <div className="flex items-center pt-12">
            <span>默认值：</span>
            <Toggle defaultChecked={!!fallback} onChange={updateFallBack} />
            <span className={styles.desc}>表达式或自定义函数因某种原因执行失败或者出现异常的时候，将使用该默认值</span>
            {/* to do support edit fallback value */}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalBindState;
