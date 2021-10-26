import React, { forwardRef, useImperativeHandle } from 'react';
import { Form } from '@QCFE/lego-ui';
import cs from 'classnames';
import { Tooltip } from 'antd';

import Icon from '@c/icon';

import './index.scss';

const { TextField, TextAreaField, CheckboxGroupField } = Form;

interface Props {
  className?: string;
  editInfo?: Pick<OptionSet, 'name' | 'tag'>;
  canExpand?: boolean;
}

export type FormAddDataRef = {
  getValues: () => any;
  validate: () => boolean;
};

// form add/edit/copy optionSet
function FormAddData({
  editInfo, className, canExpand = false,
}: Props, ref: React.Ref<FormAddDataRef>): JSX.Element {
  const formAddRef = React.createRef<Form>();

  useImperativeHandle(ref, () => {
    return {
      getValues: () => formAddRef?.current?.getFieldsValue(),
      validate: () => {
        return formAddRef?.current?.validateField('option_set_name') &&
          formAddRef?.current?.validateField('option_set_tag');
      },
    };
  });

  return (
    <Form className={cs('form-add-dataset text-blueGray-400', className)} ref={formAddRef}>
      <div className='text-blueGray-400 mb-8 ml-10'>
        选项集名称
      </div>
      <TextField
        name="option_set_name"
        placeholder="选项集名称"
        className='option-set-form-add'
        defaultValue={editInfo?.name || ''}
        schemas={[
          {
            rule: { required: true },
            help: '请输入选项集名称',
            status: 'error',
          },
          {
            rule: { maxLength: 15 },
            help: '输入超过 15 个字',
            status: 'error',
          },
        ]}
        validateOnBlur
        validateOnChange
      />
      <div className='mb-24 -mt-20 text-12 ml-10'>
        不超过15个字符，选项集名称不可重复。
      </div>
      <div className='mb-8 ml-10'>
        描述
      </div>
      <TextAreaField
        name="option_set_tag"
        defaultValue={editInfo?.tag || ''}
        placeholder="选填(不超过 100 字符)"
        className='option-set-form-add'
        rows='2'
        validateOnChange
        schemas={[
          {
            rule: { maxLength: 100 },
            help: '输入超过 100 个字',
            status: 'error',
          },
        ]}
      />
      {canExpand && (
        <div className='flex absolute mt-40 w-316'>
          <CheckboxGroupField
            name='option_set_expand'
            defaultValue={['list']}
            options={[
              {
                label: '扩展为多层选项集',
                value: 'tree',
              },
            ]}
          />
          <Tooltip
            title='扩展后，可以自由添加子级选项数据'
            color='#334155'
          >
            <Icon name='info' className='text-gray-400 mt-4 -ml-8' />
          </Tooltip>
        </div>
      )}
    </Form>
  );
}

export default forwardRef<FormAddDataRef, Props>(FormAddData);
