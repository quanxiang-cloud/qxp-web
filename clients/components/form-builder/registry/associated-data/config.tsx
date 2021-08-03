import React, { useContext, useEffect } from 'react';
import {
  SchemaForm,
  FormEffectHooks,
  createAsyncFormActions,
} from '@formily/antd';
import { Input, Switch, Select, Radio } from '@formily/antd-components';

import { StoreContext } from '@c/form-builder/context';
import { getLinkageTables, getTableSchema } from '@c/form-builder/utils/api';

import { AssociatedDataConfig } from './convertor';
import configSchema from './config-schema';

interface Props {
  initialValue: AssociatedDataConfig;
  onChange: (params: AssociatedDataConfig) => void;
}

const COMPONENTS = { Input, Select, Switch, RadioGroup: Radio.Group };
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

function getTableFieldsToOptions(
  appID: string,
  tableID: string,
  filterArr?: string[],
): Promise<LabelValue[]> {
  return getTableSchema(appID, tableID).then((res) => {
    if (res?.schema.properties) {
      return Object.entries(res?.schema.properties).reduce((acc, [key, fieldSchema]) => {
        if ((filterArr && !filterArr.includes(fieldSchema['x-component'] as string)) || key === '_id') {
          return acc;
        }

        return acc.concat([{ label: fieldSchema.title as string, value: key }]);
      }, [] as LabelValue[]);
    }

    return [];
  });
}

function AssociatedDataConfig({ initialValue, onChange }: Props): JSX.Element {
  const { appID, pageID } = useContext(StoreContext);
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
  }, [appID]);

  const setTableFieldOptions = (tableID: string, clearValue?: boolean): void => {
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
