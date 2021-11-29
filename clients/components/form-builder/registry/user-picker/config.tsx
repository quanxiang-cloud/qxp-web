import React, { useContext, useEffect } from 'react';
import {
  Form,
  FormItem,
  FormEffectHooks,
  IAntdFormItemProps,
  createFormActions,
} from '@formily/antd';
import { Input, Radio, MegaLayout, Switch } from '@formily/antd-components';

import Picker from './picker';
import UserPicker from './user-picker';
import { StoreContext } from '../../context';
import { DefaultConfig } from './convertor';
import { EnumReadOnly, EnumOptionalRange, EnumMultiple, EnumDefaultRange } from './messy/enum';

const { onFieldInputChange$ } = FormEffectHooks;
const actions = createFormActions();
const { setFieldState } = actions;

const Field = (props: IAntdFormItemProps): JSX.Element => (
  <MegaLayout labelAlign="top"><FormItem {...props} /></MegaLayout>
);

interface Props {
  initialValue: DefaultConfig
  onChange: (params: DefaultConfig) => void
}

const UserPickerConfigForm = ({ initialValue, onChange }: Props): JSX.Element => {
  const { appID, setConfigValidate } = useContext(StoreContext);

  useEffect(() => {
    onChange({ ...initialValue, appID });
  }, [appID]);

  function formEffects(): void {
    onFieldInputChange$('optionalRange').subscribe(({ value }) => {
      setFieldState('rangeList', (state) => {
        state.value = [];
      });

      setFieldState('defaultRange', (state) => {
        state.props.dataSource = value === 'all' ? EnumDefaultRange : [EnumDefaultRange[0]];
        state.value = 'customize';
      });

      setFieldState('defaultValues', (state) => {
        state.value = [];
      });
    });
  }

  useEffect(() => {
    setConfigValidate(actions.validate);
  }, [actions.validate]);

  return (
    <div>
      <Form
        actions={actions}
        initialValues={initialValue}
        onChange={(formData) => onChange(formData)}
        effects={formEffects}
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
        <Field name="multiple" title="人员选项" component={Radio.Group} dataSource={EnumMultiple} />
        <Field name="optionalRange" title="可选范围" component={Radio.Group} dataSource={EnumOptionalRange} />
        <Field
          visible={initialValue.optionalRange === 'customize'}
          rangeList={initialValue.rangeList}
          value={initialValue.rangeList}
          name="rangeList"
          title="可选列表"
          component={Picker}
        />
        <Field
          name="defaultRange"
          visible={initialValue.optionalRange !== 'currentUser'}
          title="默认值"
          component={Radio.Group}
          dataSource={EnumDefaultRange}
        />
        <Field
          name="defaultValues"
          appID={appID}
          visible={initialValue.defaultRange === 'customize' && initialValue.optionalRange !== 'currentUser'}
          optionalRange={initialValue.optionalRange}
          mode={initialValue.multiple}
          options={(initialValue.rangeList || []).map(({ ownerID, ownerName }) => {
            return { label: ownerName, value: ownerID };
          })}
          component={UserPicker}
        />
      </Form>
    </div>
  );
};

export default UserPickerConfigForm;
