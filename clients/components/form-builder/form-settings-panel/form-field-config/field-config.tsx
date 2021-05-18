import React, { useContext, useEffect, useRef } from 'react';
import { Radio, Input, Select, Switch, NumberPicker, ArrayTable, Checkbox } from '@formily/antd-components';
import { SchemaForm, ISchema, FormEffectHooks, createFormActions } from '@formily/antd';

import { StoreContext } from '../../context';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import { FieldConfigContext } from './context';
import { addOperate } from '../../registry/operates';

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
  addOperate,
};

type Props = {
  onChange: (value: any) => void;
  initialValue: any;
  schema: ISchema;
}

const { onFieldInputChange$, onFieldInit$ } = FormEffectHooks;

const useOneToManyEffects = () => {
  const { setFieldState } = createFormActions();

  onFieldInit$('minSet').subscribe((field) => {
    if (field.value !== undefined) {
      setFieldState('minimum', (state) => {
        state.visible = field.value.length === 0 ? false : true;
      });
      return;
    }
    setFieldState('minimum', (state) => {
      state.visible = false;
    });
  });

  onFieldInit$('maxSet').subscribe((field) => {
    if (field.value !== undefined) {
      setFieldState('maximum', (state) => {
        state.visible = field.value.length === 0 ? false : true;
      });
      return;
    }
    setFieldState('maximum', (state) => {
      state.visible = false;
    });
  });

  onFieldInputChange$('minSet').subscribe(({ value }) => {
    setFieldState('minimum', (state) => {
      state.visible = value.length === 0 ? false : true;
    });
  });

  onFieldInputChange$('maxSet').subscribe(({ value }) => {
    setFieldState('maximum', (state) => {
      state.visible = value.length === 0 ? false : true;
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
  const formFieldConfigWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formFieldConfigWrap.current) {
      const parent = formFieldConfigWrap.current.parentNode;
      if (parent) {
        parent.scrollTop = 0;
      }
    }
  }, [store.activeFieldName]);

  if (!store.activeField) {
    return (
      <span>前选择表单字段</span>
    );
  }

  return (
    <div ref={formFieldConfigWrap}>
      <FormFieldConfigTrue
      // assign key to FormFieldConfigTrue to force re-render when activeFieldName changed
        key={toJS(store.activeFieldName)}
        onChange={(value) => store.updateFieldConfig(value)}
        initialValue={toJS(store.activeField.configValue)}
        schema={store.activeFieldConfigSchema || {}}
      />
    </div>

  );
}

export default observer(FormFieldConfig);
