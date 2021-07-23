import React, { useContext, useEffect } from 'react';
import {
  SchemaForm,
  FormEffectHooks,
  createAsyncFormActions,
} from '@formily/antd';
import { Input, Switch, Select, Radio } from '@formily/antd-components';

import { AssociatedDataConfig } from './convertor';
import configSchema from './config-schema';
import { StoreContext } from '../../context';
import { getLinkageTables, getTableFieldsToOptions } from '../../utils/api';

interface Props {
  initialValue: AssociatedDataConfig;
  onChange: (params: AssociatedDataConfig) => void;
}
const COMPONENTS = {
  Input, Select, Switch, RadioGroup: Radio.Group,
};
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

const AssociatedData = ({ initialValue, onChange }: Props): JSX.Element => {
  const { appID } = useContext(StoreContext);
  const actions = createAsyncFormActions();
  const { setFieldState } = actions;

  useEffect(() => {
    onChange({ ...initialValue, appID });
    getLinkageTables(appID).then((pages) => {
      setFieldState('associationTableID', (state) => {
        state.props.enum = pages;
      });
    });

    if (initialValue.associationTableID) {
      getTableFieldsToOptions(appID, initialValue.associationTableID, SUPPORT_COMPONENT).then((fields) => {
        setFieldState('displayField', (state) => {
          state.props.enum = fields;
        });
      });
    }
  }, [appID]);

  const formModelEffect = (): void => {
    onFieldInputChange$('associationTableID').subscribe(({ value }) => {
      getTableFieldsToOptions(appID, value, SUPPORT_COMPONENT).then((fields) => {
        setFieldState('displayField', (state) => {
          state.value = null;
          state.props.enum = fields;
        });
      });
    });
  };

  return (
    <div>
      <SchemaForm
        initialValues={initialValue}
        actions={actions}
        effects={formModelEffect}
        onChange={(values) => onChange({ ...initialValue, ...values })}
        components={COMPONENTS}
        schema={configSchema}
      />
    </div>
  );
};

export default AssociatedData;
