import React, { useContext } from 'react';
import { Radio, Input, Select, Switch, NumberPicker, ArrayTable } from '@formily/antd-components';
import { SchemaForm, ISchema } from '@formily/antd';

import { StoreContext } from '../context';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import Icon from '@clients/components/icon';
import { FieldConfigContext } from './form-field-config-context';

const components = {
  ArrayTable,
  Input,
  NumberPicker,
  Radio,
  RadioGroup: Radio.Group,
  Select,
  Switch,
  Icon,
};

type Props = {
  onChange: (value: any) => void;
  initialValue: any;
  schema: ISchema;
}

function FormFieldConfigTrue({ onChange, initialValue, schema }: Props): JSX.Element {
  const { actions } = useContext(FieldConfigContext);
  return (
    <SchemaForm
      initialValues={initialValue}
      // todo fix this
      components={components}
      onChange={onChange}
      schema={schema}
      actions={actions}
    />
  //   <SchemaForm
  //     actions={actions}
  //     initialValues={initialValue}
  //     // todo fix this
  //     components={components}
  //     onChange={onChange}
  //     // schema={schema}
  //   >
  //     <Field
  //       name="userList"
  //       type="array"
  //       default={initialValue}
  //       x-component="ArrayTable"
  //       x-component-props={{
  //         renderMoveDown: () => null,
  //         renderMoveUp: () => null,
  //         renderAddition: () => {
  //           const mutators = actions.createMutators('userList');
  //           return (
  //             <FormSpy>s
  //               {({ state }): any => {
  //                 return state.value === 'morally' ? null : (
  //                   <div
  //                     onClick={() => {
  //                       mutators.push();
  //                     }}
  //                   >
  //                     <Icon name="add" />
  //                     添加选项
  //                   </div>
  //                 );
  //               }}
  //             </FormSpy>
  //           );
  //         },
  //         renderRemove: (idx: any) => {
  //           const mutators = actions.createMutators('userList');
  //           return (
  //             <FormSpy>
  //               {({ state }): any => {
  //                 return state.value === 'morally' ? null : (
  //                   <Icon
  //                     name="delete"
  //                     size={24}
  //                     onClick={() => {
  //                       mutators.remove(idx);
  //                     }}
  //                   />
  //                 );
  //               }}
  //             </FormSpy>
  //           );
  //         },
  //       }}
  //     >
  //       <Field type="object">
  //         <Field name="username" x-component="Input" title="选项" />
  //       </Field>
  //     </Field>
  //   </SchemaForm>
  );
}

function FormFieldConfig(): JSX.Element {
  const store = useContext(StoreContext);

  if (!store.activeField) {
    return (
      <span>请选择</span>
    );
  }

  return (
    <FormFieldConfigTrue
      // assign key to FormFieldConfigTrue to force re-render on activeFieldName changed
      key={toJS(store.activeFieldName)}
      onChange={(value) => store.updateFieldConfig(value)}
      initialValue={toJS(store.activeField.configValue)}
      schema={store.activeFieldConfigSchema || {}}
    />
  );
}

export default observer(FormFieldConfig);
