import React, { useContext, useMemo } from 'react';
import { Button } from 'antd';
import { createFormActions, SchemaForm } from '@formily/antd';

import { ItemActionsContext, ActionsContext } from '../context';
import { CONFIG_COMPONENTS, COMPONENTS } from '../constants';

interface Props {
  currentSubSchema?: ISchema;
  currentSchemaType?: string;
  onChange: (value: any) => void;
}

export default function SubTableSchemaConfig({
  currentSubSchema, onChange, currentSchemaType,
}: Props) {
  const itemActions = useMemo(() => createFormActions(), []);
  const { actions } = useContext(ActionsContext);

  if (!currentSubSchema || !currentSchemaType) {
    return null;
  }

  const currentSubSchemaDefault = CONFIG_COMPONENTS[currentSchemaType]?.configSchema;
  const currentSubSchemaConfig = CONFIG_COMPONENTS[currentSchemaType]?.defaultConfig;

  function onGoBack() {
    actions.setFieldState('Fields.curConfigSubTableKey', (state) => {
      state.value = '';
    });
  }

  return (
    <ItemActionsContext.Provider value={itemActions}>
      <div className="flex flex-row items-center mb-10">
        <Button className="mr-10" onClick={onGoBack}>返回</Button>
        <p>子表单</p>
      </div>
      <SchemaForm
        initialValues={currentSubSchemaConfig}
        components={COMPONENTS}
        onChange={onChange}
        schema={currentSubSchemaDefault}
        actions={itemActions}
      />
    </ItemActionsContext.Provider>
  );
}
