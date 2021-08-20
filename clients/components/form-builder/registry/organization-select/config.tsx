import React, { useCallback, useContext, useEffect } from 'react';
import {
  Form,
  FormItem,
  IAntdFormItemProps,
  FormEffectHooks,
  createAsyncFormActions,
} from '@formily/antd';
import { Input, Radio, MegaLayout, Switch, Select } from '@formily/antd-components';

import { getUserDepartment } from '@lib/utils';
import OrganizationSelect from './organization-select';
import { EnumReadOnly, EnumOptionalRange, EnumMultiple } from './messy/enum';
import { DefaultConfig } from './convertor';
import { StoreContext } from '../../context';

const { onFieldInputChange$ } = FormEffectHooks;

const Field = (props: IAntdFormItemProps): JSX.Element => {
  return <MegaLayout labelAlign="top"><FormItem {...props} /></MegaLayout>;
};
interface Props {
  initialValue: DefaultConfig
  onChange: (params: DefaultConfig) => void
}

const OrganizationPickerConfigForm = ({ initialValue, onChange }: Props): JSX.Element => {
  const { appID } = useContext(StoreContext);
  const actions = createAsyncFormActions();
  const { setFieldState } = actions;

  useEffect(() => {
    onChange({ ...initialValue, appID });
  }, [appID]);

  const handleChange = useCallback((obj) => {
    const extParams: any = {};
    if (obj.optionalRange === 'myDep') {
      extParams.rangeList = [window.USER.dep.id];
    }

    const nextValue = Object.assign({}, initialValue, obj, extParams);
    onChange(nextValue);
  }, [onChange, initialValue]);

  function formEffects(): void {
    onFieldInputChange$('optionalRange').subscribe(({ value }) => {
      if (['all', 'customize'].includes(value)) {
        setFieldState('defaultValues', (state) => {
          state.value = [];
        });
        setFieldState('rangeList', (state) => {
          state.value = [];
        });
      }
      if (value === 'myDep') {
        setFieldState('defaultValues', (state) => {
          const userinfo = window.USER;
          const currentUserDep = getUserDepartment(userinfo);
          const { id, departmentName } = currentUserDep;
          state.value = [{
            value: id,
            label: departmentName,
          }];
        });
      }
    });
  }

  return (
    <div>
      <Form
        defaultValue={initialValue}
        actions={actions}
        effects={formEffects}
        onChange={handleChange}
      >
        <Field
          name="title"
          title="标题名称"
          component={Input}
          required
          x-rules={{ required: true, message: '请输入标题名称' }}
          maxLength={50}
        />
        <Field name="placeholder" title="占位提示" component={Input} />
        <Field name="description" title="描述内容" component={Input.TextArea} />
        <Field name="displayModifier" title="字段属性" component={Radio.Group} dataSource={EnumReadOnly} />
        <Field name="required" title="是否必填" component={Switch} />
        <Field name="multiple" title="部门选项" component={Radio.Group} dataSource={EnumMultiple} />
        <Field name="optionalRange" title="可选范围" component={Select} dataSource={EnumOptionalRange} />
        <Field
          multiple
          appID={appID}
          visible={initialValue.optionalRange === 'customize'}
          name="rangeList"
          title="可选列表"
          component={OrganizationSelect}
        />
        <Field
          name="defaultValues"
          appID={appID}
          optionalRange={initialValue.optionalRange}
          multiple={initialValue.multiple}
          title="默认值"
          rangeList={initialValue.rangeList}
          component={OrganizationSelect}
        />
      </Form>
    </div>
  );
};

export default OrganizationPickerConfigForm;
