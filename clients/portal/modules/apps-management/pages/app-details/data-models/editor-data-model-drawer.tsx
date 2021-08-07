import React, { useState } from 'react';
import { Steps } from 'antd';
import { SchemaForm, useForm } from '@formily/antd';
import { Input } from '@formily/antd-components';

import { FooterBtnProps } from '@c/modal';
import Drawer from '@c/drawer';
import Button from '@c/button';

import FieldsDesign from './fields-design';
import { BASIC_INFO_SCHEMA } from './form-schema';

type Props = {
  isEditor: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

function EditorDataModel({ isEditor = false, onCancel, onSubmit }: Props): JSX.Element {
  const [curStep, setStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState({});
  const form = useForm({
    onSubmit: console.log,
  });

  const handleNext = () => {
    form.submit().then((res) => {
      console.log('res: ', res);
    });
  };

  const btnList: FooterBtnProps[] = curStep === 0 ? [
    {
      text: '取消',
      key: 'cancel',
      iconName: 'close',
      onClick: onCancel,
    },
    {
      text: '下一步',
      key: 'next',
      iconName: 'arrow_forward',
      modifier: 'primary',
      onClick: () => setStep(1),
    },
  ] : [
    {
      text: '上一步',
      key: 'back',
      iconName: 'arrow_back',
      onClick: () => setStep(0),
    },
    {
      text: '完成',
      key: 'confirm',
      iconName: 'check',
      modifier: 'primary',
      loading: false,
      onClick: onSubmit,
    },
  ];

  return (
    <div className='p-20'>
      <div style={{ maxWidth: '400px' }} className='mx-auto mb-32'>
        <Steps current={curStep}>
          <Steps.Step title="基本信息" />
          <Steps.Step title="字段设计" />
        </Steps>
      </div>
      {curStep === 0 && (
        <SchemaForm
          className='max-w-6xl mx-auto'
          form={form as any}
          initialValues={basicInfo}
          onChange={setBasicInfo}
          components={{ Input, TextArea: Input.TextArea }}
          schema={BASIC_INFO_SCHEMA}
        />
      )}
      {curStep === 1 && <FieldsDesign />}
      <div className='flex justify-center gap-x-10'>
        {btnList.map(({
          className = '',
          text,
          key,
          onClick,
          ...restProps
        }) => (
          <Button
            {...restProps}
            key={key}
            className={`${className}`}
            onClick={(e) => onClick(key, e)}
          >
            {text}
          </Button>
        ))}
      </div>
    </div>
  );
}

function EditorDataModelDrawer({
  visible,
  isEditor,
  onCancel,
  onSubmit,
}: Props & { visible: boolean }): JSX.Element {
  return (
    <Drawer
      visible={visible}
      title={`${isEditor ? '编辑' : '新建'}数据模型`}
      onCancel={onCancel}
    >
      <EditorDataModel onSubmit={onSubmit} isEditor={isEditor} onCancel={onCancel} />
    </Drawer>
  );
}

export default EditorDataModelDrawer;
