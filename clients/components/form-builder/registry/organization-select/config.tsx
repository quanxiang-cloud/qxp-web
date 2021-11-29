import React, { useContext, useEffect } from 'react';
import {
  Form,
  FormItem,
  IAntdFormItemProps,
  FormEffectHooks,
  createAsyncFormActions,
  useForm,
} from '@formily/antd';
import { Input, Radio, MegaLayout, Switch } from '@formily/antd-components';

import OrganizationSelect from './organization-select';
import { EnumReadOnly, EnumOptionalRange, EnumMultiple, EnumDefaultRange } from './messy/enum';
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
  const { appID, setConfigValidate } = useContext(StoreContext);
  const actions = createAsyncFormActions();
  const { setFieldState } = actions;

  useEffect(() => {
    onChange({ ...initialValue, appID });
  }, [appID]);

  function formEffects(): void {
    onFieldInputChange$('optionalRange').subscribe(({ value }) => {
      setFieldState('rangeList', (state) => {
        state.value = [];
      });

      setFieldState('defaultRange', (state) => {
        state.value = 'customize';
        state.props.dataSource = value === 'all' ? EnumDefaultRange : [EnumDefaultRange[0]];
      });

      setFieldState('defaultValues', (state) => {
        state.value = [];
      });
    });
  }

  const form = useForm({
    actions: actions,
    effects: formEffects,
    defaultValue: initialValue,
    onChange: (formData) => onChange({ ...initialValue, ...formData }),
  });

  useEffect(() => {
    setConfigValidate(form.validate);
  }, [form.validate]);

  return (
    <div>
      <Form form={form as any}>
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
        <Field name="optionalRange" title="可选范围" component={Radio.Group} dataSource={EnumOptionalRange} />
        <Field
          multiple
          appID={appID}
          visible={initialValue.optionalRange === 'customize'}
          name="rangeList"
          title="可选列表"
          component={OrganizationSelect}
        />
        <Field
          name="defaultRange"
          title="默认值"
          visible={initialValue.optionalRange !== 'currentUserDep'}
          component={Radio.Group}
          dataSource={EnumDefaultRange}
        />
        <Field
          name="defaultValues"
          appID={appID}
          visible={initialValue.defaultRange === 'customize'}
          optionalRange={initialValue.optionalRange}
          multiple={initialValue.multiple}
          rangeList={initialValue.rangeList}
          component={OrganizationSelect}
        />
      </Form>
    </div>
  );
};

export default OrganizationPickerConfigForm;
