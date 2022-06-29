import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { get } from 'lodash';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useForm } from 'react-hook-form';

import { Modal, toast } from '@one-for-all/ui';

import styles from '../index.m.scss';
interface Props {
  className?: string;
  sharedState: Record<string, any>;
  curSharedStateKey: string;
  setModalOpen: (open: boolean) => void;
  saveSharedState: (key: string, val: any) => void;
}

export type SharedVal = {
  name: string;
  val: string; // json string
  desc: string;
};

const defaultSharedVal: SharedVal = {
  name: '',
  val: JSON.stringify({ key1: 'val1' }),
  desc: '',
};

function FormAddVal({
  sharedState,
  curSharedStateKey,
  setModalOpen,
  saveSharedState,
}: Props): JSX.Element | null {
  const [curSharedVal, setCurSharedVal] = useState(defaultSharedVal);
  const { formState: { errors } } = useForm();

  useEffect(() => {
    const state = get(sharedState, curSharedStateKey);
    state && setCurSharedVal(state ? JSON.parse(state) : state);
  }, [curSharedStateKey]);

  function handleSaveSharedVal(): void {
    try {
      JSON.parse(curSharedVal.val);
    } catch (err: any) {
      toast.error(`变量值不是合法的 JS 数据: ${err.message}`);
      return;
    }
    const formData = curSharedVal;
    if (validateName(formData.name)) {
      saveSharedState(formData.name, JSON.stringify(formData));
    }
  }

  function validateName(val: string): boolean {
    if (!val) {
      toast.error('请填写变量名');
      return false;
    }
    if (!/^[\u4e00-\u9fa5_a-zA-Z0-9\-\s]+$/.test(val)) {
      toast.error('非法的变量名');
      return false;
    }
    return true;
  }

  return (
    <Modal
      className={styles.editorModal}
      title={curSharedStateKey ? '修改状态' : '新建状态'}
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
          onClick: handleSaveSharedVal,
          text: '确认',
        },
      ]}
    >
      <form className="px-40 py-24">
        <div className="flex flex-col mb-24">
          <p>状态名称</p>
          <input
            type="text"
            className={cs('input', styles.input, { [styles.error]: errors.name })}
            maxLength={20}
            value={curSharedVal.name}
            // onBlur={(ev)=> validateName(ev.target.value)}
            onChange={(ev) => {
              setCurSharedVal({
                ...curSharedVal,
                name: ev.target.value || '',
              });
            }}
          />
          <p className="text-12 text-gray-600">
            不超过 20 字符，支持字母、数字、下划线、中文，名称不可重复。
          </p>
        </div>
        <div className="flex flex-col mb-24">
          <p>状态默认值</p>
          <Editor
            value={curSharedVal.val}
            height="200px"
            // theme='dark'
            extensions={[javascript()]}
            onChange={(val) => {
              setCurSharedVal({
                ...curSharedVal,
                val,
              });
            }}
          />
        </div>
        <div className="flex flex-col">
          <p>描述</p>
          <textarea
            placeholder="选填（不超过100字符）"
            maxLength={100}
            className={cs('textarea', styles.textarea)}
            value={curSharedVal.desc}
            onChange={(ev) => {
              console.log(ev);
              setCurSharedVal({
                ...curSharedVal,
                desc: ev.target.value || '',
              });
            }}
            cols={20}
            rows={3}
          />
        </div>
      </form>
    </Modal>
  );
}

export default FormAddVal;
