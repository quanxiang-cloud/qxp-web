import React, { useContext, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import { createFormActions, SchemaForm } from '@formily/antd';

import toast from '@lib/toast';
import Button from '@c/button';
import { StoreContext } from '@c/form-builder/context';
import { validateFieldConfig } from '@c/form-builder/utils';
import { FieldConfigContext } from '@c/form-builder/form-settings-panel/form-field-config/context';

import { ItemActionsContext } from './context';
import { CONFIG_COMPONENTS, COMPONENTS, KeyOfConfigComponent } from './constants';

interface Props {
  currentSubSchema?: ISchema;
  currentSchemaType?: KeyOfConfigComponent;
  onChange: (value: any) => void;
  subTableSchema: ISchema;
  associatedFields?: any;
}

function SubTableSchemaConfig({
  currentSubSchema, onChange, currentSchemaType, subTableSchema,
}: Props): JSX.Element | null {
  const itemActions = useMemo(() => createFormActions(), []);
  const { actions } = useContext(FieldConfigContext);
  const { setFieldConfigValidator, fieldConfigValidator, getFieldValueFunc } = useContext(StoreContext);

  const currentConfigComponent = currentSchemaType ? CONFIG_COMPONENTS[currentSchemaType] : undefined;
  const currentSubSchemaDefault = currentConfigComponent?.configSchema;
  const CurrentSubSchemaForm = currentConfigComponent?.configForm;
  const currentSubSchemaConfig = currentSubSchema ?
    currentConfigComponent?.toConfig(currentSubSchema) :
    undefined;

  useEffect(() => {
    if (!currentSubSchema) {
      setFieldConfigValidator(actions.validate, actions.getFieldValue);
      return;
    }

    if (!CurrentSubSchemaForm) {
      setFieldConfigValidator(itemActions.validate, itemActions.getFieldValue);
      return;
    }
  }, [actions.validate, currentSubSchema, CurrentSubSchemaForm]);

  function onGoBack(): void {
    validateFieldConfig(fieldConfigValidator, getFieldValueFunc).then(() => {
      actions.setFieldState('Fields.curConfigSubTableKey', (state) => {
        state.value = '';
      });
    }).catch((err) => toast.error(err));
  }

  if (!currentSubSchema || !currentSchemaType) {
    return null;
  }

  return (
    <ItemActionsContext.Provider value={itemActions}>
      <div className="flex flex-row items-center mb-10">
        <Button className="mr-10" onClick={onGoBack}>返回</Button>
        <p>配置子表单字段</p>
      </div>
      {CurrentSubSchemaForm ? (
        <CurrentSubSchemaForm
          initialValue={currentSubSchemaConfig}
          onChange={onChange}
          subTableSchema={subTableSchema}
        />
      ) : (
        <SchemaForm
          initialValues={currentSubSchemaConfig}
          components={COMPONENTS}
          onChange={onChange}
          schema={currentSubSchemaDefault}
          actions={itemActions}
          effects={(selector, action) => {
            currentConfigComponent?.effects?.(selector, action);
          }}
        />
      )}
    </ItemActionsContext.Provider>
  );
}

export default observer(SubTableSchemaConfig);
