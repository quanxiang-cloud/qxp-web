/* eslint-disable no-empty */
import React, { useContext, useEffect } from 'react';
import {
  SchemaForm,
  FormEffectHooks,
  createFormActions,
} from '@formily/antd';
import { Input, Switch, Radio } from '@formily/antd-components';

import DefaultValueLinkageConfigBtn from
  '@c/form-builder/form-settings-panel/form-field-config/default-value-linkage-config-btn';
import { StoreContext } from '@c/form-builder/context';

import LinkedTable from './linked-table';
import AssociatedTableColumnsPicker from './associated-table-columns-picker';
import FilterConfigBtn from './filter-config-btn';
import configSchema from './config-schema';
import { AssociatedRecordsConfig } from './convertor';
import MergeConfig from './merge-config';
import AssociativeConfig from './associative-rules-config';
import { getTableSchema } from '@lib/http-client-form';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import { toJS } from 'mobx';
import SelectAllConfig from './select-all-config';
import FilterConfig from './filter-config';

interface Props {
  initialValue: AssociatedRecordsConfig;
  onChange: (params: AssociatedRecordsConfig) => void;
}

const COMPONENTS = {
  Input,
  Switch,
  RadioGroup: Radio.Group,
  LinkedTable,
  AssociatedTableColumnsPicker,
  DefaultValueLinkageConfigBtn,
  FilterConfigBtn,
  FilterConfig,
  MergeConfig,
  AssociativeConfig,
  SelectAllConfig,
};

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks;
const actions = createFormActions();

export async function getTableFieldsToOptions(
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

export const SUPPORT_COMPONENT = [
  'Input',
  'NumberPicker',
  'Textarea',
  'RadioGroup',
  'CheckboxGroup',
  'Select',
  'MultipleSelect',
  'DatePicker',
  // 'ImageUpload',
  'CascadeSelector',
  'UserPicker',
  'OrganizationPicker',
  'Serial',
  'AssociatedData',
]; // 关联记录表下支持关联表白名单
const WHITE_LIST = [
  'input',
// 'numberpicker', 'userpicker', 'datepicker', 'select'
];

function AssociatedRecordsConfig({ initialValue, onChange }: Props): JSX.Element {
  const { appID, schema, setFieldConfigValidator } = useContext(StoreContext);
  const { setFieldState } = actions;

  const getSupportFieldsToOptions = (): SchemaFieldItem[] => {
    const _schema = { ...schema, properties: schemaToMap(schema) };
    const _fields = schemaToFields(_schema);
    const supportFields = toJS(_fields).filter(({ componentName }) => {
      return WHITE_LIST.includes(componentName);
    });

    return supportFields;
  };

  const setTableFieldOptions = (
    tableID: string, associativeRules?: FormBuilder.DataAssignment[],
  ): void => {
    getTableFieldsToOptions(appID, tableID, SUPPORT_COMPONENT).then((fields) => {
      setFieldState('associativeConfig', (state) => {
        state.props['x-component-props'] = {
          sourceTableFields: fields,
          currentFormFields: getSupportFieldsToOptions(),
          associativeRules: associativeRules,
        };
      });
    });
  };
  useEffect(() => {
    actions.setFieldState('filterConfig', (state) => {
      state.props['x-component-props'] = {
        appID, tableID: initialValue.linkedTable?.tableID, currentFormSchema: schema,
      };
    });
    if (initialValue?.linkedTable) {
      const { tableID } = initialValue.linkedTable || {};
      tableID && setTableFieldOptions(tableID, initialValue?.associativeConfig?.rules);
    }
  }, [appID, initialValue.linkedTable]);

  useEffect(() => {
    setFieldConfigValidator(actions.validate);
  }, [actions.validate]);

  const formModelEffect = (): void => {
    onFieldInputChange$('linkedTable').subscribe(({ value }) => {
      actions.setFieldState('filterConfig', (state) => {
        state.props['x-component-props'] = { appID, tableID: value.tableID, currentFormSchema: schema };
      });
    });
    onFieldValueChange$('linkedTable').subscribe(({ value }) => {
      if (value?.appID !== initialValue?.linkedTable?.appID ||
        value?.tableID !== initialValue?.linkedTable?.tableID) {
        actions.setFieldState('associativeConfig', (state: any) => {
          if (state.props['x-component-props'].associativeRules) {
            state.props['x-component-props'].associativeRules = [];
          }
          state.value = null;
        });
        actions.setFieldState('filterConfig', (state) => {
          state.value = null;
        });
      }
    });
  };
  const search = window.location.search;
  if (search.indexOf('jump_to_home') > -1) {
    if (configSchema.properties?.Fields?.properties?.addNewRecords) {
      try {
        configSchema.properties.Fields.properties.addNewRecords.visible = true;
      } catch (error) {
      }
    }
  }
  return (
    <SchemaForm
      initialValues={{
        ...initialValue,
        filterConfig: {
          ...initialValue.filterConfig,
          showSelectAll: true,
        },
      }}
      actions={actions}
      effects={formModelEffect}
      onChange={(values) => {
        const _initialValue = JSON.parse(JSON.stringify(initialValue));
        const _values = JSON.parse(JSON.stringify(values));
        delete _initialValue?.filterConfig?.showSelectAll;
        delete _values?.filterConfig?.showSelectAll;
        onChange({ ..._initialValue, ..._values });
      }}
      components={COMPONENTS}
      schema={configSchema}
    />
  );
}

export default AssociatedRecordsConfig;
