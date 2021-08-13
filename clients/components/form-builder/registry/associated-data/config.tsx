import React, { useContext, useEffect } from 'react';
import {
  SchemaForm,
  FormEffectHooks,
  createAsyncFormActions,
} from '@formily/antd';
import { Input, Switch, Select, Radio } from '@formily/antd-components';

import FilterConfig from '@c/form-builder/form-settings-panel/form-field-config/filter-config';
import { StoreContext } from '@c/form-builder/context';

import { getLinkageTables, getTableSchema } from '@c/form-builder/utils/api';
import schemaToFields from '@lib/schema-convert';

import { AssociatedDataConfig } from './convertor';
import configSchema from './config-schema';

interface Props {
  initialValue: AssociatedDataConfig;
  onChange: (params: AssociatedDataConfig) => void;
  subTableSchema: ISchema;
}

const COMPONENTS = { Input, Select, Switch, RadioGroup: Radio.Group, FilterConfig };
const { onFieldInputChange$ } = FormEffectHooks;
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
];

async function getTableFieldsToOptions(
  appID: string,
  tableID: string,
  filterArr?: string[],
): Promise<LabelValue[]> {
  const res = await getTableSchema(appID, tableID);
  if (res?.schema.properties) {
    return schemaToFields(res.schema).reduce((acc: LabelValue[], field) => {
      if (!filterArr?.includes(field['x-component'] || '') || field.id === '_id') {
        return acc;
      }

      return acc.concat([{ label: field.title as string, value: field.id }]);
    }, []);
  }
  return [];
}

function AssociatedDataConfig({ initialValue, onChange, subTableSchema }: Props): JSX.Element {
  const { appID, pageID, schema: _schema } = useContext(StoreContext);
  const schema = subTableSchema || _schema;
  const actions = createAsyncFormActions();
  const { setFieldState } = actions;

  useEffect(() => {
    onChange({ ...initialValue, appID });
    getLinkageTables(appID).then((pages) => {
      setFieldState('associationTableID', (state) => {
        state.props.enum = pages.filter(({ value }) => value !== pageID);
      });
    });

    if (initialValue.associationTableID) {
      setTableFieldOptions(initialValue.associationTableID);
    }
  }, [appID, initialValue.associationTableID]);

  const setTableFieldOptions = (tableID: string, clearValue?: boolean): void => {
    setFieldState('filterConfig', (state) => {
      state.props['x-component-props'] = { appID, tableID, currentFormSchema: schema };
    });
    getTableFieldsToOptions(appID, tableID, SUPPORT_COMPONENT).then((fields) => {
      setFieldState('fieldName', (state) => {
        state.props.enum = fields;
        if (clearValue) {
          state.value = null;
        }
      });
    });
  };

  const formModelEffect = (): void => {
    onFieldInputChange$('associationTableID').subscribe(({ value }) => {
      setTableFieldOptions(value, true);
    });
  };

  return (
    <SchemaForm
      initialValues={initialValue}
      actions={actions}
      effects={formModelEffect}
      onChange={(values) => onChange({ ...initialValue, ...values, appID })}
      components={COMPONENTS}
      schema={configSchema}
    />
  );
}

export default AssociatedDataConfig;
