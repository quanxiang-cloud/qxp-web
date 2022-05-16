import React, { useEffect, useState } from 'react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { parse, Node } from 'acorn';
import { get, set } from 'lodash';

import Icon from '@one-for-all/icon';
import { FunctionalProperty, LifecycleHookFuncSpec } from '@one-for-all/artery';

import toast from '@lib/toast';
import Modal from '@c/modal';
import Tooltip from '@c/tooltip';

import { useConfigContext } from '../context';
import { ConnectedProps } from '../utils/connect';
import { updateNodeProperty, findNode } from '../utils';

import styles from './index.m.scss';

export const HOOKS_PREFIX = 'lifecycleHooks';

type AstNode = Node & { body: Node[] }

export function generateInitFunString({ name = '', args = '', notes = '', body = '' }): string {
  let defaultNotes = '';
  const userNotes = notes ? `// ${notes}` : '';
  if (args === '...args') {
    defaultNotes =
`/** 
  * 如果在事件属性描述中没有传递 \`args\` 变量对函数参数进行描述的话
  * 会默认使用 \`...args\` 作为函数参数
  * 这样的目的是为了避免需要用到函数参数却没有声明的情况
  * 因此 \`...args\` 并非一定存在
*/`;
  }
  return `${defaultNotes}
${userNotes}
function ${name}(${args}) {${body}}`;
}

function isFunctionValid(ast: AstNode): boolean {
  if (!ast.body.length) {
    throw new Error('不存在处理函数');
  }

  if (ast.body.length > 1) {
    throw new Error('所有内容都应该定义在函数体内');
  }
  const [firstNode] = ast.body;
  if (firstNode.type !== 'FunctionDeclaration') {
    throw new Error('不存在处理函数');
  }

  return true;
}

function getFnBody(ast: AstNode, fnString: string): string {
  const [firstNode] = ast.body;
  const { body } = firstNode as any;
  return fnString.slice(body.start + 1, body.end - 1);
}

function FunctionBind({
  __path,
  args = '...args',
  name,
  notes,
}: ConnectedProps<{
  args?: string;
  notes?: string;
  name?: string;
}>): JSX.Element {
  const { activeNode, artery, onArteryChange } = useConfigContext() ?? {};
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [hasBound, setHasBound] = useState<boolean>(false);
  const [fnString, setFnString] = useState<string>(
    generateInitFunString({
      name: name || __path.split('.').pop() || 'func',
      args,
      notes,
    }),
  );
  const isLifecycleHooks = __path.startsWith(HOOKS_PREFIX);
  const functionSpec: FunctionalProperty | LifecycleHookFuncSpec = isLifecycleHooks ?
    {
      type: 'lifecycle_hook_func_spec',
      args: '',
      body: '',
    } :
    {
      type: 'functional_property',
      func: {
        type: '',
        args: args,
        body: '',
      },
    };
  const bodyPath = isLifecycleHooks ? 'body' : 'func.body';
  const fullPath = `${__path}.${bodyPath}`;
  useEffect(() => {
    setHasBound(!!get(activeNode, fullPath));
  }, [activeNode]);

  function onEdit(): void {
    if (!activeNode || !artery) {
      return;
    }
    const node = findNode(artery.node, activeNode.id);
    setFnString(generateInitFunString({
      name: name || __path.split('.').pop() || 'func',
      args,
      notes,
      body: get(node, fullPath, ''),
    }));
    setModalOpen(true);
  }

  function onUnbind(): void {
    if (!activeNode || !artery) {
      return;
    }
    setFnString('');
    set(functionSpec, bodyPath, '');
    onArteryChange?.(updateNodeProperty(activeNode, __path, functionSpec, artery));
    setHasBound(false);
  }

  function onBind(): void {
    setModalOpen(true);
  }

  function addAction(fnString: string): void {
    try {
      const parseAst = parse(fnString, {
        ecmaVersion: 'latest',
        sourceType: 'script',
      });
      const isValid = isFunctionValid(parseAst as AstNode);
      if (isValid && activeNode && artery) {
        const bodyString = getFnBody(parseAst as AstNode, fnString);
        set(functionSpec, bodyPath, bodyString);
        onArteryChange?.(updateNodeProperty(activeNode, __path, functionSpec, artery));
        setHasBound(true);
        setModalOpen(false);
      }
    } catch (e) {
      toast.error(e || '非法的函数定义');
    }
  }

  return (
    <>
      {hasBound ? (
        <div className="inline-flex items-center w-full">
          <span className="border border-gray-100 flex-1 w-100 mr-8 px-8 py-4">已绑定</span>
          <Tooltip position="top" label="编辑绑定函数">
            <div className="mr-16" onClick={onEdit}>
              <Icon name="code" />
            </div>
          </Tooltip>
          <Tooltip position="top" label="解绑函数">
            <div onClick={onUnbind}>
              <Icon name="link" />
            </div>
          </Tooltip>
        </div>
      ) : (
        <div className={styles.btnAdd} onClick={onBind}>
          <Icon name="add" />
          <span>定义事件</span>
        </div>
      )}
      {/* TODO:move to root */}
      {modalOpen && (
        <Modal
          title="定义事件"
          width={1200}
          height={600}
          onClose={() => setModalOpen(false)}
          footerBtns={[
            {
              key: 'close',
              iconName: 'close',
              onClick: () => setModalOpen(false),
              text: '取消',
            },
            {
              key: 'check',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => {
                fnString && addAction(fnString);
              },
              text: '绑定动作',
            },
          ]}
        >
          <div className={styles.modal}>
            <div className="h-full">
              <Editor
                value={fnString}
                height="400px"
                extensions={[javascript()]}
                onChange={(value) => {
                  setFnString(value);
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default FunctionBind;
