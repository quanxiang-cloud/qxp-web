import React, { useState } from 'react';
import cs from 'classnames';
import { SchemaForm, createFormActions } from '@formily/antd';
import { Input, Select } from '@formily/antd-components';
import { Steps } from 'antd';

import { FooterBtnProps } from '@c/modal';
import Button from '@c/button';

import schema from './schema';

interface Props {
  className?: string;
  isEdit?: boolean;
  onSubmit: (data: FormDataCreateApiGroup) => void;
  onCancel: () => void;
}

enum stepKey {
  basic,
  others,
}

const components = {
  Input,
  TextArea: Input.TextArea,
  Select,
};

const actions = createFormActions();

function FormAddGroup({ className, isEdit, onSubmit, onCancel }: Props): JSX.Element {
  const [step, setStep] = useState(stepKey.basic);
  const [formData, setFormData] = useState({}); // todo: move to mobx

  const handleNext = () => {
    // todo: validate form
    setStep(step + 1);
  };

  const renderBtns = () => {
    const btns: FooterBtnProps[] = step === stepKey.basic ? [
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
        onClick: handleNext,
      },
    ] : [
      {
        text: '上一步',
        key: 'back',
        iconName: 'arrow_back',
        onClick: () => setStep(step - 1),
      },
      {
        text: '完成',
        key: 'confirm',
        iconName: 'check',
        modifier: 'primary',
        loading: false,
        // todo
        onClick: () => onSubmit(null),
      },
    ];

    return (
      <div className='flex justify-center mt-40 gap-x-20'>
        {btns.map(({ className = '', text, key, onClick, ...rest }) => (
          <Button
            key={key}
            className={className}
            onClick={(e) => onClick(key, e)}
            {...rest}
          >
            {text}
          </Button>
        ))
        }
      </div>
    );
  };

  return (
    <div className={cs('py-20 h-full', className)}>
      <div className='flex items-center mb-20 w-259 mx-auto'>
        <Steps current={step}>
          <Steps.Step title="基本信息" key='basic' />
          <Steps.Step title="其它属性" key='others' />
        </Steps>
      </div>

      {step === stepKey.basic && (
        <SchemaForm
          className='max-w-%90'
          labelCol={6}
          schema={schema}
          components={components}
          actions={actions}
          onSubmit={onSubmit}
          initialValues={formData}
        />
      )}
      {step === stepKey.others && (
        <div></div>
      )}
      {renderBtns()}
    </div>
  );
}

export default FormAddGroup;
