import React from 'react';
import {
  Form,
  FormItem,
  IAntdFormItemProps,
} from '@formily/antd';
import { Input, Radio, MegaLayout, Switch } from '@formily/antd-components';

import { DefaultConfig } from './convertor';
import { EnumReadOnly, EnumOptionalRange, EnumMultiple } from './messy/enum';
import Picker from './picker';
import UserPicker from './user-picker';

const Field = (props: IAntdFormItemProps): JSX.Element => (
  <MegaLayout labelAlign="top"><FormItem {...props} /></MegaLayout>
);

interface Props {
  initialValue: DefaultConfig
  onChange: (params: DefaultConfig) => void
}

const UserPickerConfigForm = ({ initialValue, onChange }: Props): JSX.Element => {
  const handleChange = (formData: any): void => {
    onChange({ ...initialValue, ...formData });
  };

  return (
    <div>
      <Form initialValues={initialValue} onChange={handleChange}>
        <Field name="title" title="标题" component={Input} />
        <Field name="placeholder" title="占位提示" component={Input} />
        <Field name="description" title="描述内容" component={Input.TextArea} />
        <Field name="displayModifier" title="字段属性" component={Radio.Group} dataSource={EnumReadOnly} />
        <Field name="required" title="是否必填" component={Switch} />
        <Field name="multiple" title="人员选项" component={Radio.Group} dataSource={EnumMultiple} />
        <Field name="optionalRange" title="可选范围" component={Radio.Group} dataSource={EnumOptionalRange} />
        <Field
          isMy={initialValue.optionalRange === 'myDep'}
          visible={initialValue.optionalRange !== 'all'}
          rangeList={initialValue.rangeList}
          value={initialValue.rangeList}
          name="rangeList"
          title="可选列表"
          component={Picker}
        />
        <Field
          name="defaultValues"
          title="默认值"
          optionalRange={initialValue.optionalRange}
          mode={initialValue.multiple}
          options={(initialValue.rangeList || []).map(({ ownerID, ownerName }) => {
            return { label: ownerName, value: ownerID };
          })}
          component={UserPicker}
        />
        {/* <Picker value={initialValue.rangeList} onChange={handleDefaultUserChange} /> */}
      </Form>
    </div>
  );
};

export default UserPickerConfigForm;
