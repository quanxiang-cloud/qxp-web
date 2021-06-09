import React, { useCallback } from 'react';
import {
  Form,
  FormItem,
  IAntdFormItemProps,
} from '@formily/antd';
import { Input, Radio, MegaLayout, Switch } from '@formily/antd-components';
import { useQuery } from 'react-query';

import { EnumOptionalRange, EnumMultiple } from './messy/enum';
import { DefaultConfig } from './convertor';
import OrganizationDefault from './organization-default';
import PickerCascader from './picker-cascader';
import { StoreContext } from '../../context';
import { searchOrganziation } from './messy/api';

const Field = (props: IAntdFormItemProps): JSX.Element => <MegaLayout labelAlign="top"><FormItem {...props} /></MegaLayout>;

interface Props {
  initialValue: DefaultConfig
  onChange: (params: any) => void
}

const OrganizationPickerConfigForm = ({ initialValue, onChange }: Props): JSX.Element => {
  const ref = React.useRef();
  const store = React.useContext(StoreContext);
  const { appID } = store;
  const { data } = useQuery(['query_user_picker', appID], () => searchOrganziation(appID));

  console.log('>>>>>>>>>initialValue', initialValue);
  const handleChange = useCallback((obj) => {
    console.log('obj', ref, obj);
    const extParams: any = {};
    if (obj.optionalRange == 'myDep') {
      // const target = searchTree(parseTree(data) as TreeNode, window.USER.dep.id)
      // extParams.rangeList = [target]
      extParams.rangeList = [window.USER.dep.id];
    }
    const nextValue = Object.assign({}, initialValue, obj, extParams);
    onChange(nextValue);
    console.log('nextValue', nextValue);
  }, [onChange, initialValue]);

  return (<div>
    <Form defaultValue={initialValue} onChange={handleChange}>
      <Field name="title" title="标题" component={Input} />
      <Field name="placeholder" title="占位提示" component={Input} />
      <Field name="description" title="描述内容" component={Input.TextArea} />
      <Field name="required" title="是否必填" component={Switch} />
      <Field name="multiple" title="部门选项" component={Radio.Group} dataSource={EnumMultiple} />
      <Field name="optionalRange" title="可选范围" component={Radio.Group} dataSource={EnumOptionalRange} />
      <Field isMy={initialValue.optionalRange == 'myDep'} visible={initialValue.optionalRange != 'all'} name="rangeList" title="可选范围" mode={'multiSelect'} component={PickerCascader} />
      <Field name="defaultValues" optionalRange={initialValue.optionalRange} multiple={initialValue.multiple} title="默认值" rangeList={initialValue.rangeList} component={OrganizationDefault} />
    </Form>
  </div>);
};

export default OrganizationPickerConfigForm;
