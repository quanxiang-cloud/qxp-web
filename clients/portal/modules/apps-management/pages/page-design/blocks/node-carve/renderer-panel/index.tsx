import React, { useEffect, useState } from 'react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { pick, get, set } from 'lodash';
import cs from 'classnames';
import { toJS } from 'mobx';

import { Button, Icon, Tooltip, Modal, toast } from '@one-for-all/ui';

import DataBind, { iterableStateTypes } from '../repository/state-bind';
import Section from '../../../utils/section';
import { mapRawProps } from '../../../utils/artery-adapter';

import styles from './index.m.scss';
import { ConfigContextState, useConfigContext } from '../context';
import {
  ComposedNode,
  ComposedNodeChild,
  ComposeOutLayer,
  ConstantProperty,
  IndividualLoopContainer,
  ReactComponentNode,
} from '@one-for-all/artery';
import {
  setNodeAsComposedNode,
  updateCurNodeAsLoopContainer,
} from '../utils';
import { generateNodeId } from '@one-for-all/artery-engine';

const defaultToPropsFn = 'return state';
const defaultLoopKey = 'id';

function RendererPanel(): JSX.Element {
  const { activeNode, rawActiveNode, artery, onArteryChange } =
    useConfigContext() as ConfigContextState;
  const [toPropsFn, setToPropsFn] = useState(defaultToPropsFn);
  const [loopKey, setLoopKey] = useState(defaultLoopKey);
  const [modalBindConstOpen, setModalBindConstOpen] = useState(false);
  const [bindConst, setBindConst] = useState('null'); // 绑定的常量循环数据

  useEffect(() => {
    // todo: get cur loop node conf
    const rawNode = rawActiveNode;
    if (!rawNode) {
      return;
    }
    if (rawNode?.type === 'loop-container') {
      const { iterableState, loopKey, toProps } = pick(
        rawNode as IndividualLoopContainer,
        ['iterableState', 'loopKey', 'toProps'],
      );
      let node = rawNode.node;
      if (rawNode.node.type === 'composed-node') {
        node = rawNode.node.outLayer as ComposeOutLayer;
      }
      const rawPropsKeys = Object.keys(mapRawProps(node.props || {})).join(',');
      setToPropsFn(
        get(toProps, 'body', `//${rawPropsKeys}\n${defaultToPropsFn}`),
      );
      setLoopKey(loopKey || '');

      if (iterableState?.type === 'constant_property') {
        setBindConst(iterableState.value as string);
      }
    } else {
      const toProps = get(rawNode, 'toProps', {});
      const rawPropsKeys = Object.keys(mapRawProps(rawNode.props || {})).join(
        ',',
      );
      setToPropsFn(
        get(toProps, 'body', `//${rawPropsKeys}\n${defaultToPropsFn}`),
      );
    }
  }, [rawActiveNode]);

  // useUpdateEffect(()=> {
  //   // console.log('sync all loop conf to elem: %s, %s, %o', toPropsFn, loopKey, toJS(bindConst));
  //   // todo: debounce update
  //   const rawNode = page.rawActiveElem;
  //   if (rawNode.type === 'loop-container') {
  //     page.updateCurNodeAsLoopContainer('loopKey', loopKey || defaultLoopKey);
  //     page.updateCurNodeAsLoopContainer('toProps', toPropsFn || defaultToPropsFn);
  //   }
  // }, [toPropsFn, loopKey]);

  // useUpdateEffect(()=> {
  //   page.updateCurNodeAsLoopContainer('loopKey', loopKey || defaultLoopKey);
  //   page.updateCurNodeAsLoopContainer('toProps', toPropsFn || defaultToPropsFn);
  // }, [bindConst]);

  function handleBindConstVal(): void {
    try {
      if (!activeNode) {
        return;
      }

      const bindVal = JSON.parse(bindConst);
      if (bindVal === null) {
        setModalBindConstOpen(false);
        return;
      }

      if (!Array.isArray(bindVal)) {
        toast.error('循环数据必须为数组');
        return;
      }

      const { exportName, children } = activeNode as ReactComponentNode;
      const isComposedNode = (children || []).every(
        (item) => item.type === 'react-component',
      );
      if (exportName === 'container' && isComposedNode) {
        const newChildren = (children || []).map((child) => {
          const rawPropsKeys = Object.keys(mapRawProps(child.props || {})).join(
            ',',
          );
          const toProps = get(child, 'toProps', {});
          const { type, args, body } = toProps;
          set(child, 'toProps', {
            type: type || 'to_props_function_spec',
            args: args || 'state',
            body: body || `// ${rawPropsKeys} \nreturn {}`,
          });
          return child;
        });
        const iterableState: ConstantProperty = {
          type: 'constant_property',
          value: bindVal,
        };

        const node = toJS(activeNode);
        const _node = { ...node };
        if ('children' in _node) {
          delete _node.children;
        }
        onArteryChange(
          setNodeAsComposedNode(
            activeNode,
            {
              iterableState,
              node: {
                id: generateNodeId('composed-node'),
                type: 'composed-node',
                outLayer: { ..._node } as ComposeOutLayer,
                children: newChildren as ComposedNodeChild[],
              } as ComposedNode,
            },
            artery,
          ),
        );
      } else {
        onArteryChange(
          updateCurNodeAsLoopContainer(
            activeNode,
            'iterableState',
            {
              type: 'constant_property',
              value: bindVal,
            },
            artery,
          ),
        );
      }

      setModalBindConstOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function hasBindConst(): boolean {
    const rawNode = rawActiveNode;
    if (rawNode && rawNode.type === 'loop-container') {
      const isConstType =
        get(rawNode, 'iterableState.type') === 'constant_property';
      const val = get(rawNode, 'iterableState.value');
      if (!isConstType) {
        return false;
      }

      try {
        const parsedVal = typeof val === 'string' ? JSON.parse(val) : val;
        return Array.isArray(parsedVal);
      } catch (err: unknown) {
        return false;
      }
    }
    return false;
  }

  const iterType = get(rawActiveNode, 'iterableState.type');
  const hasBindVariable = iterableStateTypes.includes(iterType);
  const hasBind = hasBindConst() || hasBindVariable;

  return (
    <>
      <div className={styles.renderPanel}>
        <Section title='条件渲染' defaultExpand>
          <div className='flex items-center justify-between mb-4'>
            <label>配置组件渲染条件</label>
            <DataBind __path="shouldRender" />
          </div>
          <pre className="p-4 text-12 text-blue-400 bg-gray-100">
            <p>本质是配置JS中if流程语句中的条件表达式</p>
            <p>当且仅当配置最终结果为真值时渲染展示此节点</p>
          </pre>
        </Section>
        <Section title="循环展示" defaultExpand>
          <form className="flex flex-col">
            <div className="mb-8">
              <p>循环数据</p>
              <div className="flex items-center justify-between">
                <Button
                  className={cs({ [styles.boundConst]: hasBindConst() })}
                  onClick={() => setModalBindConstOpen(true)}
                >
                  {hasBindConst() ? '已绑定常量数据' : '绑定常量数据'}
                </Button>
                <DataBind
                  __path="loop-node"
                  isSetLoopNode
                />
              </div>
            </div>
            {hasBind && (
              <div className="mb-8">
                <p>循环 Key</p>
                <div className="flex items-center justify-between">
                  <input
                    className="mr-8 pg-input"
                    placeholder="默认为 id"
                    value={loopKey}
                    onChange={(ev) => {
                      setLoopKey(ev.target.value);
                      activeNode &&
                        onArteryChange(
                          updateCurNodeAsLoopContainer(
                            activeNode,
                            'loopKey',
                            ev.target.value,
                            artery,
                          ),
                        );
                    }}
                  />
                </div>
              </div>
            )}
            <div className="mb-8">
              <p className="flex items-center">
                <span className="mr-8">组件属性映射函数(toProps)</span>
                <Tooltip position="top" label="将当前循环数据映射到组件属性">
                  <Icon name="info" />
                </Tooltip>
              </p>
              <div className="text-12">
                <p>示例:</p>
                <pre className="text-12 text-blue-400 bg-gray-100">
                  {
                    '// 将当前循环数据作为组件props\n 1. return state\n\n// 将当前循环数据的data属性\n// 作为组件的app属性\n 2. return { app: state.data }'
                  }
                </pre>
                <div className="text-gray-400">
                  <p>
                    state
                    为页面引擎传入的当前变量(请勿修改名称)，您只需修改state的表达式即可。
                  </p>
                  <p>
                    代码编辑器只接收函数体的表达式，不需要填写完整的函数定义,
                    注意表达式需带上 return 关键字
                  </p>
                </div>
              </div>
              {hasBind && (
                <Editor
                  value={toPropsFn}
                  height="120px"
                  extensions={[javascript()]}
                  onChange={(value) => {
                    setToPropsFn(value);
                    activeNode &&
                      onArteryChange(
                        updateCurNodeAsLoopContainer(
                          activeNode,
                          'toProps',
                          value,
                          artery,
                        ),
                      );
                  }}
                />
              )}
            </div>
          </form>
        </Section>
      </div>
      {modalBindConstOpen && (
        <Modal
          title="绑定常量循环数据"
          onClose={() => setModalBindConstOpen(false)}
          footerBtns={[
            {
              key: 'close',
              iconName: 'close',
              onClick: () => setModalBindConstOpen(false),
              text: '取消',
            },
            {
              key: 'check',
              iconName: 'check',
              modifier: 'primary',
              onClick: handleBindConstVal,
              text: '绑定',
            },
          ]}
        >
          <Editor
            value={
              typeof bindConst === 'string' ?
                bindConst :
                JSON.stringify(bindConst)
            }
            height="120px"
            extensions={[javascript()]}
            onChange={(value) => {
              setBindConst(value);
            }}
          />
        </Modal>
      )}
    </>
  );
}

export default RendererPanel;
