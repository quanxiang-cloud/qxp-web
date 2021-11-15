import React, { useState, useImperativeHandle, forwardRef } from 'react';
import cs from 'classnames';
import { SchemaForm, createFormActions } from '@formily/antd';
import { Input, Select, Radio } from '@formily/antd-components';
import toast from '@lib/toast';

interface Props<T> {
  schema: ISchema;
  children?: React.ReactNode;
  className?: string;
  formProps?: Record<string, any>;
  extraComponents?: Record<string, any>;
  // valueTransform?: (values: T)=> T;
  defaultValues?: T;
}

const validComponents = {
  Input,
  TextArea: Input.TextArea,
  Select,
  RadioGroup: Radio.Group,
};

export type RefType<T> = {getValues: ()=> Promise<T>};

const actions = createFormActions();

function Form<T>(props: Props<T>, ref: React.Ref<RefType<T>>): JSX.Element {
  const [formData, setFormData] = useState<T | undefined>(props.defaultValues);

  useImperativeHandle(ref, ()=> ({
    // validate and return form values
    getValues: ()=> {
      return actions.validate('*').then(()=> {
        return actions.getFormState().values;
      }).catch(({ errors }: {errors: Array<{
          path: string
          messages: string[]
        }>})=> {
        if (errors.length) {
          toast.error(errors[0].messages);
        }
      });
    },
  }));

  return (
    <div className={cs('py-20 h-full', props.className)}>
      <SchemaForm
        className='max-w-%90'
        // labelCol={6}
        schema={props.schema}
        components={{ ...validComponents, ...props.extraComponents }}
        actions={actions}
        onChange={(values)=> {
          setFormData(values);
        }}
        initialValues={formData}
        {...props.formProps}
      >
        {props.children as JSX.Element}
      </SchemaForm>
    </div>
  );
}

export default forwardRef(Form);
