import React, { useContext } from 'react';
import { Radio, Input, Select, Switch, NumberPicker, ArrayTable, Checkbox } from '@formily/antd-components';
import { SchemaForm, ISchema, FormEffectHooks, createFormActions } from '@formily/antd';

import { StoreContext } from '../context';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import { FieldConfigContext } from './form-field-config-context';

const components = {
  ArrayTable,
  Input,
  NumberPicker,
  Radio,
  RadioGroup: Radio.Group,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  Select,
  Switch,
};

type Props = {
  onChange: (value: any) => void;
  initialValue: any;
  schema: ISchema;
}

const { onFieldInputChange$, onFieldInit$ } = FormEffectHooks;

const useOneToManyEffects = () => {
  const { setFieldState } = createFormActions();

  onFieldInit$('Fields.min.minSet').subscribe((field) => {
    if (field.value !== undefined) {
      setFieldState('Fields.min.minimum', (state) => {
        state.visible = field.value.length===0 ? false : true;
      });
      return;
    }
    setFieldState('Fields.min.minimum', (state) => {
      state.visible = false;
    });
  });

  onFieldInit$('Fields.max.maxSet').subscribe((field) => {
    if (field.value !== undefined) {
      setFieldState('Fields.max.maximum', (state) => {
        state.visible = field.value.length===0 ? false : true;
      });
      return;
    }
    setFieldState('Fields.max.maximum', (state) => {
      state.visible = false;
    });
  });

  onFieldInputChange$('Fields.min.minSet').subscribe(({ value }) => {
    setFieldState('Fields.min.minimum', (state) => {
      state.visible = value.length===0 ? false : true;
    });
  });

  onFieldInputChange$('Fields.max.maxSet').subscribe(({ value }) => {
    setFieldState('Fields.max.maximum', (state) => {
      state.visible = value.length===0 ? false : true;
    });
  });
};

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
      effects={() => useOneToManyEffects()}
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
