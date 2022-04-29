import React, { useEffect, useState } from 'react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import Icon from '@one-for-all/icon';
import { RadioGroup, Radio } from '@one-for-all/headless-ui';

import toast from '@lib/toast';
import Modal from '@c/modal';
import Tooltip from '@c/tooltip';

import { useConfigContext } from '../context';
import { ConnectedProps } from '../utils/connect';

import styles from './index.m.scss';
import { updateNodeProperty } from '../utils';
import { get, set } from 'lodash';
import { FunctionalProperty, LifecycleHookFuncSpec } from '@one-for-all/artery';

export const HOOKS_PREFIX = 'lifecycleHooks.';

function FunctionBind({ __path, notes }: ConnectedProps<{
  notes?: string;
}>): JSX.Element {
  const { activeNode, artery, onArteryChange } = useConfigContext() ?? {};
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [hasBound, setHasBound] = useState<boolean>(false);
  const [eventType, setEventType] = useState<string>('custom');
  const [fnString, setFnString] = useState<string>(notes ? `// ${notes}` : '');
  const isLifecycleHooks = __path.startsWith(HOOKS_PREFIX);
  const functionSpec: FunctionalProperty | LifecycleHookFuncSpec = isLifecycleHooks ? {
    type: 'lifecycle_hook_func_spec',
    args: '',
    body: '',
  } : {
    type: 'functional_property',
    func: {
      type: '',
      args: '...args',
      body: '',
    },
  };
  const bodyPath = isLifecycleHooks ? 'body' : 'func.body';
  const fullPath = `${__path}.${bodyPath}`;
  useEffect(() => {
    setHasBound(!!get(activeNode, fullPath));
  }, [get(activeNode, __path)]);

  function onEdit(): void {
    if (!activeNode || !artery) {
      return;
    }
    setFnString(get(activeNode, fullPath, ''));
    setModalOpen(true);
  }

  function onUnbind(): void {
    if (!activeNode || !artery) {
      return;
    }
    set(functionSpec, bodyPath, '');
    onArteryChange?.(updateNodeProperty(activeNode, __path, functionSpec, artery));
  }

  function onBind(): void {
    setModalOpen(true);
  }

  function addAction(fnString: string): void {
    if (fnString && activeNode && artery) {
      set(functionSpec, bodyPath, fnString);
      onArteryChange?.(updateNodeProperty(activeNode, __path, functionSpec, artery));
      setModalOpen(false);
    } else {
      toast.error('非法的函数定义');
    }
  }

  return (
    <>
      {hasBound ? (
        <div className="inline-flex items-center w-full">
          <span className="border border-gray-100 flex-1 w-100 mr-8 px-8 py-4">
            已绑定
          </span>
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
          <span>绑定动作</span>
        </div>
      )}
      {/* TODO:move to root */}
      {modalOpen && (
        <Modal
          title="事件绑定"
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
            <div className={styles.eventType}>
              <p className="text-12 text-gray-600">动作类型</p>
              <RadioGroup
                onChange={(val: any) => setEventType(val)}
                value={eventType}
              >
                {/* <Radio key='platform' label='平台方法' value='platform' defaultChecked={eventType === 'platform'} />*/}
                <Radio key="custom" label="自定义方法" value="custom" />
              </RadioGroup>
            </div>
            <div className={styles.side}>
              <div className="flex justify-between items-center cursor-pointer
                px-16 py-4 hover:bg-gray-200 bg-gray-200">
                <span>添加新动作</span>
                <Icon name="check" />
              </div>
            </div>
            <div className='h-full'>
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
