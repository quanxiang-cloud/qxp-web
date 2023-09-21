/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-empty */
import React, { useContext, useEffect } from 'react';
import {
  SchemaForm,
  createFormActions,
} from '@formily/antd';
import { Input, Switch, Radio } from '@formily/antd-components';

import FilterConfig from '@c/form-builder/registry/associated-data/filter-config';
import DefaultValueLinkageConfigBtn from
  '@c/form-builder/form-settings-panel/form-field-config/default-value-linkage-config-btn';
import { StoreContext } from '@c/form-builder/context';

import LinkedTable from './linked-table';
import configSchema from './config-schema';
import { TableDataCreateConfig } from './convertor';
import LinkedTableField from './linked-table-field';
import CreateRules from './create-rules';

interface Props {
  initialValue: TableDataCreateConfig;
  onChange: (params: TableDataCreateConfig) => void;
}

const COMPONENTS = {
  Input,
  Switch,
  RadioGroup: Radio.Group,
  LinkedTable,
  LinkedTableField,
  CreateRules,
  DefaultValueLinkageConfigBtn,
  FilterConfig,
};

// const { onFieldInputChange$ } = FormEffectHooks;
const actions = createFormActions();

function TableDataCreateConfig(props: Props): JSX.Element {
  const { initialValue, onChange } = props;
  const {
    appID,
    pageID,
    setFieldConfigValidator,
  } = useContext(StoreContext);

  useEffect(() => {
    actions.setFieldState('createRules', (state) => {
      state.props['x-component-props'] = {
        appID,
        pageID,
        tableID: initialValue.linkedTable?.tableID,
      };
    });
  }, [appID, initialValue.linkedTable]);

  useEffect(() => {
    setFieldConfigValidator(actions.validate);
  }, [actions.validate]);

  const formModelEffect = (): void => {
    // onFieldInputChange$('linkedTable').subscribe(() => {
    //   actions.setFieldState('linkedTableField', (state) => {
    //     state.value = undefined;
    //   });
    // });
  };

  const handleChange = (values: any) => {
    onChange(values);
  };

  return (
    <SchemaForm
      initialValues={initialValue}
      actions={actions}
      components={COMPONENTS}
      schema={configSchema}
      effects={formModelEffect}
      onChange={handleChange}
    />
  );
}

export default TableDataCreateConfig;
