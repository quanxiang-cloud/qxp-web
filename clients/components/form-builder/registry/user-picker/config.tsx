import React, { useContext, useEffect } from 'react';
import {
  Form,
  FormItem,
  FormEffectHooks,
  IAntdFormItemProps,
  createFormActions,
} from '@formily/antd';
import { Input, Radio, MegaLayout, Switch, Select } from '@formily/antd-components';

import Picker from './picker';
import UserPicker from './user-picker';
import { StoreContext } from '../../context';
import { DefaultConfig } from './convertor';
import { EnumReadOnly, EnumOptionalRange, EnumMultiple } from './messy/enum';

const { onFieldInputChange$ } = FormEffectHooks;

const Field = (props: IAntdFormItemProps): JSX.Element => (
  <MegaLayout labelAlign="top"><FormItem {...props} /></MegaLayout>
);

interface Props {
  initialValue: DefaultConfig
  onChange: (params: DefaultConfig) => void
}

const UserPickerConfigForm = ({ initialValue, onChange }: Props): JSX.Element => {
  const { appID } = useContext(StoreContext);
  const actions = createFormActions();
  const { setFieldState } = actions;

  useEffect(() => {
    onChange({ ...initialValue, appID });
  }, [appID]);

  function formEffects(): void {
    onFieldInputChange$('optionalRange').subscribe(() => {
      setFieldState('defaultValues', (state) => {
        state.value = [];
      });
      setFieldState('rangeList', (state) => {
        state.value = [];
      });
    });
  }

  return (
    <div>
      <Form
        actions={actions}
        initialValues={initialValue}
        onChange={(formData) => onChange({ ...initialValue, ...formData })}
        effects={formEffects}
      >
        <Field name="title" title="标题" component={Input} />
        <Field name="placeholder" title="占位提示" component={Input} />
        <Field name="description" title="描述内容" component={Input.TextArea} />
        <Field name="displayModifier" title="字段属性" component={Radio.Group} dataSource={EnumReadOnly} />
        <Field name="required" title="是否必填" component={Switch} />
        <Field name="multiple" title="人员选项" component={Radio.Group} dataSource={EnumMultiple} />
        <Field name="optionalRange" title="可选范围" component={Select} dataSource={EnumOptionalRange} />
        <Field
          isMy={initialValue.optionalRange === 'currentUser'}
          visible={initialValue.optionalRange === 'customize'}
          rangeList={initialValue.rangeList}
          value={initialValue.rangeList}
          name="rangeList"
          title="可选列表"
          component={Picker}
        />
        <Field
          name="defaultValues"
          title="默认值"
          visible={initialValue.optionalRange !== 'currentUser'}
          appID={appID}
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
