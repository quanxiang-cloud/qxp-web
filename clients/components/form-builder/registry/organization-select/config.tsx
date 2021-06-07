import React, { useCallback } from 'react';
import {
  Form,
  FormItem,
  IAntdFormItemProps,
} from '@formily/antd';
import { Input, Radio, MegaLayout, Switch } from '@formily/antd-components';

import { EnumOptionalRange, EnumMultiple } from './messy/enum';
import { DefaultConfig } from './convertor';
import OrganizationDefault from './organization-default';
import PickerCascader from './picker-cascader';

const Field = (props: IAntdFormItemProps): JSX.Element => <MegaLayout labelAlign="top"><FormItem {...props} /></MegaLayout>;

interface Props {
    initialValue: DefaultConfig
    onChange: (params: any) => void
}

const OrganizationPickerConfigForm = ({ initialValue, onChange }: Props): JSX.Element => {
  const handleChange = useCallback((obj) => {
    const nextValue = Object.assign({}, initialValue, obj);
    onChange(nextValue);
  }, [onChange, initialValue]);

  return (<div>
    <Form defaultValue={initialValue} onChange={handleChange}>
      <Field name="title" title="标题" component={Input} />
      <Field name="placeholder" title="占位提示" component={Input} />
      <Field name="description" title="描述内容" component={Input.TextArea} />
      <Field name="required" title="是否必填" component={Switch} />
      <Field name="multiple" title="部门选项" component={Radio.Group} dataSource={EnumMultiple} />
      <Field name="optionalRange" title="可选范围" component={Radio.Group} dataSource={EnumOptionalRange} />
      <Field visible={initialValue.optionalRange == 'customize'} name="rangeList" title="可选范围" mode={'multiSelect'} component={PickerCascader} />
      <Field name="defaultValues" optionalRange={initialValue.optionalRange} multiple={initialValue.multiple} title="默认值" rangeList={initialValue.rangeList} component={OrganizationDefault} />
    </Form>
  </div>);
};

export default OrganizationPickerConfigForm;
