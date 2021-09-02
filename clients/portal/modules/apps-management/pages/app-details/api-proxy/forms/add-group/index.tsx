import React, { useState } from 'react';
import cs from 'classnames';
import { SchemaForm, createFormActions } from '@formily/antd';
import { Input, Select, Radio } from '@formily/antd-components';
import { Steps } from 'antd';
import { get, set } from 'lodash';

import StepBtns from './step-btns';
import { basicSchema, othersSchema } from './schema';

type Params=Record<string, any>;
type FormValues={basic?: Params, others?: Params} | undefined;

interface Props {
  className?: string;
  isEdit?: boolean;
  onSubmit: (data: FormDataCreateApiGroup) => void;
  onCancel: () => void;
  defaultValues?: FormValues;
}

enum stepKey {
  basic,
  others,
}

const components = {
  Input,
  TextArea: Input.TextArea,
  Select,
  RadioGroup: Radio.Group,
};

const actions = createFormActions();

function FormAddGroup({ className, isEdit, defaultValues, onSubmit, onCancel }: Props): JSX.Element {
  const [step, setStep] = useState(stepKey.basic);
  const [formData, setFormData] = useState<FormValues>(defaultValues);

  const handleNext = ()=> {
    actions.validate('*').then(()=>{
      setStep(step + 1);
    }).catch(()=> {});
  };

  return (
    <div className={cs('py-20 h-full', className)}>
      <div className='flex items-center mb-20 w-259 mx-auto'>
        <Steps current={step}>
          <Steps.Step title="基本信息" key='basic' />
          <Steps.Step title="分组配置" key='others' />
        </Steps>
      </div>
      {step === stepKey.basic && (
        <SchemaForm
          className='max-w-%90'
          labelCol={6}
          schema={basicSchema}
          components={components}
          actions={actions}
          onChange={(values)=> {
            setFormData((vals)=> set(vals || {}, 'basic', values));
          }}
          onSubmit={onSubmit}
          initialValues={get(formData, 'basic', {})}
        />
      )}
      {step === stepKey.others && (
        <SchemaForm
          className='max-w-%90'
          labelCol={6}
          schema={othersSchema}
          components={components}
          actions={actions}
          onChange={(values)=> {
            setFormData((vals)=> set(vals || {}, 'others', values));
          }}
          onSubmit={onSubmit}
          initialValues={get(formData, 'others', {})}
        />
      )}
      <StepBtns
        step={step}
        onCancel={onCancel}
        onPrev={()=> setStep(step - 1)}
        onNext={handleNext}
        onSubmit={()=> {}}
      />
    </div>
  );
}

export default FormAddGroup;
