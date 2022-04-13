import React, { useContext, useEffect } from 'react';
import { toJS } from 'mobx';
import { filter } from 'rxjs/operators';
import { Input, Switch, Select, Radio } from '@formily/antd-components';
import {
  useForm,
  SchemaForm,
  FormEffectHooks,
  createAsyncFormActions,
  IForm,
} from '@formily/antd';
import { FormInstance } from 'antd';

import { schemaToMap } from '@lib/schema-convert';
import FilterConfig from '@c/form-builder/registry/associated-data/filter-config';
import { StoreContext } from '@c/form-builder/context';
import { getTableSchema } from '@lib/http-client';
import schemaToFields from '@lib/schema-convert';
import { getFormDataMenuList } from '@c/form-table-selector/api';

import configSchema from './config-schema';
import { AssociatedDataConfig } from './convertor';
import AssociativeConfig from './associative-rules-config';

interface Props {
  initialValue: AssociatedDataConfig;
  onChange: (params: AssociatedDataConfig) => void;
  subTableSchema: ISchema;
}

const COMPONENTS = { Input, Select, Switch, RadioGroup: Radio.Group, FilterConfig, AssociativeConfig };
const { onFieldValueChange$, onFieldInit$ } = FormEffectHooks;
const SUPPORT_COMPONENT = [
  'Input',
  'NumberPicker',
  'Textarea',
  'RadioGroup',
  'CheckboxGroup',
  'Select',
  'MultipleSelect',
  'DatePicker',
  'ImageUpload',
  'CascadeSelector',
  'UserPicker',
  'OrganizationPicker',
  'Serial',
];
const WHITE_LIST = ['input', 'numberpicker', 'userpicker', 'datepicker'];

async function getTableFieldsToOptions(
  appID: string,
  tableID: string,
  filterArr?: string[],
): Promise<SchemaFieldItem[]> {
  const res = await getTableSchema(appID, tableID);
  if (res?.schema.properties) {
    return schemaToFields(res.schema).filter((field) => {
      if (!filterArr?.includes(field['x-component'] || '') || field.id === '_id') {
        return false;
      }

      return field;
    });
  }
  return [];
}

function AssociatedDataConfig({ initialValue, onChange, subTableSchema }: Props): JSX.Element {
  const { appID, pageID, schema: _schema, setFieldConfigValidator } = useContext(StoreContext);
  const schema = subTableSchema || _schema;
  const actions = createAsyncFormActions();
  const { setFieldState } = actions;

  const setTableFieldOptions = (
    tableID: string, associativeRules?: FormBuilder.DataAssignment[], clearValue?: boolean,
  ): void => {
    setFieldState('filterConfig', (state) => {
      state.props['x-component-props'] = { appID, tableID, currentFormSchema: schema };
    });

    getTableFieldsToOptions(appID, tableID, SUPPORT_COMPONENT).then((fields) => {
      setFieldState('fieldName', (state) => {
        state.props.enum = fields.map(({ title, id }) => {
          return { label: title as string, value: id };
        });
        if (clearValue) {
          state.value = null;
        }
      });

      setFieldState('associativeConfig', (state) => {
        state.props['x-component-props'] = {
          sourceTableFields: fields,
          currentFormFields: getSupportFieldsToOptions(),
          associativeRules: associativeRules,
        };
      });
    });
  };

  const getSupportFieldsToOptions = (): SchemaFieldItem[] => {
    const _schema = { ...schema, properties: schemaToMap(schema) };
    const _fields = schemaToFields(_schema);
    const supportFields = toJS(_fields).filter(({ componentName }) => {
      return WHITE_LIST.includes(componentName);
    });

    return supportFields;
  };

  const formModelEffect = (): void => {
    onFieldInit$('associativeConfig').subscribe(() => {
      setFieldState('associativeConfig', (state) => {
        state.visible = !!toJS(initialValue).associationTableID;
      });
    });

    onFieldValueChange$('associationTableID').pipe(
      filter(({ value }) => !!value),
    ).subscribe(({ value }) => {
      setFieldState('associativeConfig', (state) => {
        state.visible = true;
      });

      if (initialValue.associationTableID === value) {
        setTableFieldOptions(value, initialValue.associativeConfig?.rules, false);
        return;
      }

      setTableFieldOptions(value, [], true);
    });
  };

  const form = useForm({
    actions: actions,
    effects: formModelEffect,
    onChange: (values) => onChange({ ...initialValue, ...values, appID }),
    initialValues: initialValue,
  });

  useEffect(() => {
    setFieldConfigValidator(form.validate);
  }, [form.validate]);

  useEffect(() => {
    onChange({ ...initialValue, appID });
    getFormDataMenuList(appID).then((pages) => {
      setFieldState('associationTableID', (state) => {
        state.props.enum = pages.filter(({ value }) => value !== pageID);
      });
    });

    if (initialValue.associationTableID) {
      setTableFieldOptions(initialValue.associationTableID, initialValue.associativeConfig?.rules);
    }
  }, [appID, initialValue.associationTableID]);

  return (
    <SchemaForm
      form={form as IForm & FormInstance}
      components={COMPONENTS}
      schema={configSchema}
    />
  );
}

export default AssociatedDataConfig;
