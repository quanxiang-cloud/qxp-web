import React, { useContext, useMemo } from 'react';
import { Button } from 'antd';
import { createFormActions, SchemaForm } from '@formily/antd';

import { ItemActionsContext, ActionsContext } from './context';
import { CONFIG_COMPONENTS, COMPONENTS, KeyOfConfigComponent } from './constants';

interface Props {
  currentSubSchema?: ISchema;
  currentSchemaType?: KeyOfConfigComponent;
  onChange: (value: any) => void;
  subTableSchema: ISchema;
}

export default function SubTableSchemaConfig({
  currentSubSchema, onChange, currentSchemaType, subTableSchema,
}: Props): JSX.Element | null {
  const itemActions = useMemo(() => createFormActions(), []);
  const { actions } = useContext(ActionsContext);

  if (!currentSubSchema || !currentSchemaType) {
    return null;
  }

  const currentSubSchemaDefault = CONFIG_COMPONENTS[currentSchemaType]?.configSchema;
  const CurrentSubSchemaForm = CONFIG_COMPONENTS[currentSchemaType]?.configForm;
  const currentSubSchemaConfig = CONFIG_COMPONENTS[currentSchemaType]?.toConfig(currentSubSchema);

  function onGoBack(): void {
    actions.setFieldState('Fields.curConfigSubTableKey', (state) => {
      state.value = '';
    });
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
        />
      )}
    </ItemActionsContext.Provider>
  );
}
