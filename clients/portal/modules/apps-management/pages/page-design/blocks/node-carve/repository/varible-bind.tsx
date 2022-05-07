import React, { useEffect, useState } from 'react';
import { get, isObject } from 'lodash';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import Button from '@c/button';
import Modal from '@c/modal';
import toast from '@lib/toast';

import { ConnectedProps } from '../utils/connect';
import { updateNodeProperty } from '../utils';
import { useConfigContext } from '../context';

interface VaribleBindProps {
  type: 'array' | 'object',
  text?: string;
}

function VaribleBind({
  __path,
  type,
  text = '输入变量',
}: ConnectedProps<VaribleBindProps>): JSX.Element {
  const { activeNode, onArteryChange, artery } = useConfigContext() ?? {};
  const [modalVisible, setModalVisible] = useState(false);
  const [varibleString, setVaribleString] = useState<string>();

  useEffect(() => {
    const value = get(activeNode, `${__path}.value`, '');
    const valueString = JSON.stringify(value, null, 2);
    setVaribleString(valueString);
  }, []);

  function handleBindVaribleSave(): void {
    try {
      if (!activeNode || !artery) {
        return;
      }

      const varible = JSON.parse(varibleString || '');
      if (varible === null) {
        setModalVisible(false);
        return;
      }

      if (type === 'array' && !Array.isArray(varible)) {
        toast.error('必须为数组');
        return;
      }

      if (type === 'object' && !isObject(varible)) {
        toast.error('必须为对象');
        return;
      }

      onArteryChange?.(updateNodeProperty(activeNode, __path, varible, artery));
      setModalVisible(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <Button onClick={() => setModalVisible(true)}>{text}</Button>
      {/* TODO:move to root */}
      {modalVisible && (
        <Modal
          title="绑定变量"
          onClose={() => setModalVisible(false)}
          footerBtns={[
            {
              key: 'close',
              iconName: 'close',
              onClick: () => setModalVisible(false),
              text: '取消',
            },
            {
              key: 'check',
              iconName: 'check',
              modifier: 'primary',
              onClick: handleBindVaribleSave,
              text: '绑定',
            },
          ]}
        >
          <Editor
            value={
              typeof varibleString === 'string' ?
                varibleString : JSON.stringify(varibleString)
            }
            height="120px"
            extensions={[javascript()]}
            onChange={(value) => {
              setVaribleString(value);
            }}
          />
        </Modal>
      )}
    </>
  );
}

export default VaribleBind;
