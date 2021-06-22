import React, { JSXElementConstructor, useEffect, useState, useContext } from 'react';
import { useQuery } from 'react-query';

import { getTableSchema } from '@lib/http-client';
import type { NodeWorkForm, Data, BusinessData } from '@flowEditor/type';

import FormDataForm from './form-data';
import ApproveForm from './intermidiate/approve';
import ProcessVariableAssignmentConfig from './process-variable-assignment-config';
import FlowTableContext from './flow-source-table';
import FlowContext from '../../../flow-context';

interface Props {
  workForm: NodeWorkForm;
  defaultValue: Data;
  onSubmit: (data: BusinessData) => void;
  onCancel: () => void;
}

function Placeholder(): JSX.Element | null {
  return null;
}

function useTableSchema(appID: string, tableID: string): ISchema | null {
  const [schema, setSchema] = useState<ISchema | null>(null);

  const { data, isLoading, isError } = useQuery<ISchema>(['FETCH_TABLE_SCHEMA', appID, tableID], () => {
    return getTableSchema(appID, tableID).then(({ schema }) => {
      return schema || {};
    });
  });

  useEffect(() => {
    if (isLoading || isError || !data) {
      return;
    }

    setSchema(data);
  }, [data, isLoading, isError]);

  return schema;
}

const components: Record<string, JSXElementConstructor<any>> = {
  formData: FormDataForm,
  approve: ApproveForm,
  fillIn: ApproveForm,
  processBranch: Placeholder,
  processVariableAssignment: ProcessVariableAssignmentConfig,
  tableDataCreate: Placeholder,
  tableDataUpdate: Placeholder,
  sendEmail: Placeholder,
  cc: Placeholder,
  webMessage: Placeholder,
};

export default function Form({
  workForm,
  defaultValue,
  onSubmit,
  onCancel,
}: Props): JSX.Element {
  function getConfigForm(): JSX.Element {
    const component = components[defaultValue.type];
    return React.createElement(component, {
      defaultValue: defaultValue.businessData,
      onSubmit,
      onCancel,
      nodeType: defaultValue.type,
    });
  }
  const { appID } = useContext(FlowContext);
  const sourceTableSchema = useTableSchema(appID, workForm?.value || '');

  if (!sourceTableSchema) {
    return (
      <div>loading...</div>
    );
  }

  return (
    <FlowTableContext.Provider
      value={{
        tableID: workForm?.value || '',
        tableName: workForm?.name || '',
        tableSchema: sourceTableSchema,
      }}
    >
      <div className="flex-1" style={{ height: 'calc(100% - 56px)' }}>
        {getConfigForm()}
      </div>
    </FlowTableContext.Provider>
  );
}
