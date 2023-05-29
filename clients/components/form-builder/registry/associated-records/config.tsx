import React, { useContext, useEffect } from 'react';
import {
  SchemaForm,
  FormEffectHooks,
  createFormActions,
} from '@formily/antd';
import { Input, Switch, Radio } from '@formily/antd-components';

import FilterConfig from '@c/form-builder/registry/associated-data/filter-config';
import DefaultValueLinkageConfigBtn from
  '@c/form-builder/form-settings-panel/form-field-config/default-value-linkage-config-btn';
import { StoreContext } from '@c/form-builder/context';

import LinkedTable from './linked-table';
import AssociatedTableColumnsPicker from './associated-table-columns-picker';
import FilterConfigBtn from './filter-config-btn';
import configSchema from './config-schema';
import { AssociatedRecordsConfig } from './convertor';

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
};

const { onFieldInputChange$ } = FormEffectHooks;
const actions = createFormActions();

function AssociatedRecordsConfig({ initialValue, onChange }: Props): JSX.Element {
  const { appID, schema, setFieldConfigValidator } = useContext(StoreContext);

  useEffect(() => {
    actions.setFieldState('filterConfig', (state) => {
      state.props['x-component-props'] = {
        appID, tableID: initialValue.linkedTable?.tableID, currentFormSchema: schema,
      };
    });
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
  };

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
