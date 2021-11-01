import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  SchemaForm,
  createFormActions,
} from '@formily/antd';
import { Input, Radio, NumberPicker } from '@formily/antd-components';

import { StoreContext } from '@c/form-builder/context';

import Prefix from './prefix';
import configSchema from './config-schema';
import { SerialConfig } from './convertor';
import effects from './effects';

interface Props {
  initialValue: SerialConfig;
  onChange: (params: SerialConfig) => void;
}

const COMPONENTS = {
  Input,
  Prefix,
  RadioGroup: Radio.Group,
  NumberPicker,
};

const actions = createFormActions();

function SerialConfig({ initialValue, onChange }: Props): JSX.Element {
  const { activeFieldId, activeSubtableFieldId, serialFieldIds } = useContext(StoreContext);

  useEffect(() => {
    const fieldID = activeSubtableFieldId || activeFieldId;
    if (serialFieldIds.includes(fieldID)) {
      actions.setFieldState('startingValue', (state) => {
        state.props['x-component-props'] = { disabled: true };
      });
      actions.setFieldState('initialPosition', (state) => {
        state.props['x-component-props'] = { disabled: true };
      });
    }
  }, [activeFieldId, activeSubtableFieldId, serialFieldIds]);

  return (
    <SchemaForm
      initialValues={initialValue}
      actions={actions}
      effects={effects}
      onChange={(values) => onChange({ ...initialValue, ...values })}
      components={COMPONENTS}
      schema={configSchema}
    />
  );
}

export default observer(SerialConfig);
