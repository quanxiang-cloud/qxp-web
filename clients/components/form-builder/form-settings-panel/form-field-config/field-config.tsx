import React, { useContext, useEffect, useRef } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Radio, Input, Select, Switch, NumberPicker, ArrayTable, Checkbox } from '@formily/antd-components';
import {
  SchemaForm, ISchema, IFormEffect, ISchemaFormActions, ISchemaFormAsyncActions,
} from '@formily/antd';

import { StoreContext } from '@c/form-builder/context';

import EditLabels from './edit-labels';
import OptionsConfig from './options-config';
import { FieldConfigContext } from './context';
import InputForLabels from './input-for-labels';
import CalculationFormulaBtn from './calculation-formula-btn';
import DefaultValueLinkageConfigBtn from './default-value-linkage-config-btn';
import FormApi from './form-api';

const COMMON_CONFIG_COMPONENTS = {
  ArrayTable,
  Input,
  NumberPicker,
  Radio,
  RadioGroup: Radio.Group,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  Select,
  Switch,
  EditLabels,
  OptionsConfig,
  DefaultValueLinkageConfigBtn,
  CalculationFormulaBtn,
  InputForLabels,
  FormApi,
};

type Props = {
  onChange: (value: any) => void;
  initialValue: any;
  schema: ISchema;
  components: Record<string, React.JSXElementConstructor<any>>;
  effects?: IFormEffect<any, ISchemaFormActions | ISchemaFormAsyncActions>;
}

function SchemaFieldConfig({ onChange, initialValue, schema, components, effects }: Props): JSX.Element {
  const store = useContext(StoreContext);
  const { actions } = useContext(FieldConfigContext);

  useEffect(() => {
    store.setFieldConfigValidator(actions.validate, actions.getFieldValue);
  }, [actions.validate]);

  return (
    <SchemaForm
      initialValues={initialValue}
      // todo fix this
      components={components}
      onChange={onChange}
      schema={schema}
      actions={actions}
      effects={effects}
    />
  );
}

function FormFieldConfig(): JSX.Element {
  const store = useContext(StoreContext);
  const formFieldConfigWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formFieldConfigWrap.current) {
      (formFieldConfigWrap.current.parentNode as HTMLDivElement).scrollTop = 0;
    }
  }, [store.activeFieldId]);

  if (!store.activeField) {
    return (
      <span>请选择表单字段</span>
    );
  }

  if (store.activeFieldSourceElement?.configSchema) {
    return (
      <div ref={formFieldConfigWrap}>
        <SchemaFieldConfig
          // assign key to FormFieldConfigTrue to force re-render when activeFieldId changed
          effects={(selector, action) => {
            if (typeof store.activeFieldSourceElement?.effects === 'function') {
              store.activeFieldSourceElement.effects(selector, action);
            }
          }}
          key={toJS(store.activeFieldId)}
          onChange={(value) => store.updateFieldConfig(value)}
          initialValue={toJS(store.activeField.configValue)}
          schema={store.activeFieldSourceElement?.configSchema}
          components={{
            ...COMMON_CONFIG_COMPONENTS,
            ...store.activeFieldSourceElement?.configDependencies,
          }}
        />
      </div>
    );
  }

  if (store.activeFieldSourceElement?.configForm) {
    return React.createElement(store.activeFieldSourceElement.configForm, {
      key: toJS(store.activeFieldId),
      onChange: (value: any) => store.updateFieldConfig(value),
      initialValue: toJS(store.activeField.configValue),
    });
  }

  return (<div>当前字段不支持配置</div>);
}

export default observer(FormFieldConfig);
