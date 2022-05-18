import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';
import { Modal, toast } from '@one-for-all/ui';

import { getQuery } from '@lib/utils';
import ApiSelector from '@polyApi/nodes/forms/request-config/api-selector';

import styles from '../index.m.scss';

type Props = {
  closeModal: () => void;
  onSelectApi: (name: string, apiPath: string, method: string, desc?: string) => void;
  existSameName: (name: string) => boolean;
};

export default function SelectApiModal({
  closeModal,
  onSelectApi,
  existSameName,
}: Props): JSX.Element {
  const [apiPath, setApiPath] = useState('');
  const [method, setMethod] = useState('');
  const { register, formState: { errors }, handleSubmit, getValues, trigger, clearErrors } = useForm();
  const { appID } = getQuery<{ appID: string }>();

  function onSubmit(): void {
    if (!apiPath || !method) {
      toast.error('请选择API');
      return;
    }
    onSelectApi(getValues().name, apiPath, method, getValues().desc);
    closeModal();
  }

  function handleChangeApi(apiPath: string, method?: string): void {
    setApiPath(apiPath);
    setMethod((method || 'get').toLowerCase());
  }

  function validateName(name: string): boolean {
    if (!name) {
      toast.error('请填写变量名');
      return false;
    }
    if (!/^[\u4e00-\u9fa5_a-zA-Z0-9\-\s]+$/.test(name)) {
      toast.error('非法的变量名');
      return false;
    }
    if (existSameName(name)) {
      toast.error('变量名已存在');
      return false;
    }
    return true;
  }

  return (
    <Modal
      title='选择平台 API'
      width={800}
      onClose={closeModal}
      footerBtns={[
        {
          key: 'close',
          iconName: 'close',
          onClick: closeModal,
          text: '取消',
        },
        {
          key: 'check',
          iconName: 'check',
          modifier: 'primary',
          onClick: () => {
            trigger().then((valid) => {
              if (!valid) return;
              onSubmit();
            });
          },
          text: '确定导入',
        },
      ]}
    >
      <form
        className='px-40 py-24'
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => {
          trigger().then((valid) => {
            if (valid) {
              clearErrors();
            }
          });
        }}
      >
        <div className='mb-24'>
          <p className='text-12 text-gray-600'>API变量名称</p>
          <input
            type="text"
            style={{ width: '259px' }}
            className={cs('input', styles.input, { [styles.error]: errors.name })}
            maxLength={120}
            {...register('name', {
              shouldUnregister: true,
              validate: validateName,
            })}
          />
          <p className='text-12 text-gray-600'>不超过 120 字符，支持字母、数字、下划线、中文，名称不可重复。</p>
        </div>
        <div>
          <div className='flex flex-col mb-24 relative -top-8'>
            <p className='text-12 text-gray-600'>选择 API</p>
            <ApiSelector
              simpleMode
              usePolyApiOption
              appID={appID}
              className='api-selector-wrap'
              initRawApiPath=""
              setApiPath={handleChangeApi}
            />
          </div>
        </div>
        <div>
          <div className='flex flex-col mb-24 relative -top-8'>
            <p className='text-12 text-gray-600'>描述</p>
            <textarea
              placeholder='选填（不超过100字符）'
              maxLength={100}
              className={cs('textarea', styles.textarea)}
              cols={20}
              rows={3}
              {...register('desc', {
                shouldUnregister: true,
              })}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
