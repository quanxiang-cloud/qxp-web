import React, { useContext } from 'react';
import { Radio, Input, Select, Switch, NumberPicker, ArrayTable } from '@formily/antd-components';
import { SchemaForm, ISchema } from '@formily/antd';

import { StoreContext } from '../context';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

const components = {
  ArrayTable,
  Input,
  NumberPicker,
  Radio,
  RadioGroup: Radio.Group,
  Select,
  Switch,
};

type Props = {
  onChange: (value: any) => void;
  initialValue: any;
  schema: ISchema;
}

function FormFieldConfigTrue({ onChange, initialValue, schema }: Props): JSX.Element {
  return (
    <SchemaForm
      initialValues={initialValue}
      // todo fix this
      components={components}
      onChange={onChange}
      schema={schema}
    />
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
      // assign key to FormFieldConfigTrue to force re-render when activeFieldName changed
      key={toJS(store.activeFieldName)}
      onChange={(value) => store.updateFieldConfig(value)}
      initialValue={toJS(store.activeField.configValue)}
      schema={store.activeFieldConfigSchema || {}}
    />
  );
}

export default observer(FormFieldConfig);
