import React, { JSXElementConstructor, useEffect, useState, useContext } from 'react';
import { useQuery } from 'react-query';

import { getTableSchema } from '@lib/http-client';
import type { NodeWorkForm, Data, BusinessData } from '@flowEditor/type';
import schemaToFields from '@lib/schema-convert';

import FormDataForm from './form-data';
import ApproveForm from './intermidiate/approve';
import SendEmailConfig from './send-email-config';
import CopyTo from './copy-to';
import WebMessage from './web-message';
import ProcessVariableAssignmentConfig from './process-variable-assignment-config';
import FlowTableContext from './flow-source-table';
import CreateTableData from './create-table-data';
import UpdateTableData from './update-table-data';
import FlowContext from '../../../flow-context';
import ProcessBranch from './process-branch';
import ProcessBranchTarget from './process-branch-target';

interface Props {
  workForm: NodeWorkForm;
  defaultValue: Data;
  onSubmit: (data: BusinessData) => void;
  onCancel: () => void;
  onChange: (data: BusinessData) => void;
}

function useTableSchema(appID: string, tableID: string): [ReturnType<typeof schemaToFields>, boolean] {
  const [schema, setSchema] = useState<ISchema>();

  const { data, isLoading, isError } = useQuery<ISchema>(['FETCH_TABLE_SCHEMA', appID, tableID], () => {
    if (!tableID) {
      return Promise.resolve({});
    }

    return getTableSchema(appID, tableID).then((pageSchema) => (pageSchema?.schema || {}));
  });

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }

    if (!data) {
      return setSchema({});
    }

    setSchema(data);
  }, [data, isLoading, isError]);

  return [schemaToFields(schema), isLoading];
}

const components: Record<string, JSXElementConstructor<any>> = {
  formData: FormDataForm,
  approve: ApproveForm,
  fillIn: ApproveForm,
  processBranch: ProcessBranch,
  processBranchTarget: ProcessBranchTarget,
  processVariableAssignment: ProcessVariableAssignmentConfig,
  tableDataCreate: CreateTableData,
  email: SendEmailConfig,
  autocc: CopyTo,
  letter: WebMessage,
  tableDataUpdate: UpdateTableData,
};

export default function Form({
  workForm,
  defaultValue,
  onSubmit,
  onCancel,
  onChange,
}: Props): JSX.Element {
  function getConfigForm(): JSX.Element {
    const component = components[defaultValue.type];
    return React.createElement(component, {
      defaultValue: defaultValue.businessData,
      onSubmit,
      onCancel,
      onChange,
      nodeType: defaultValue.type,
    });
  }
  const { appID } = useContext(FlowContext);
  const [sourceTableSchema, isLoading] = useTableSchema(appID, workForm?.value || '');

  if (isLoading) {
    // todo handle error case
    return (<div>loading...</div>);
  }

  return (
    <FlowTableContext.Provider
      value={{
        tableID: workForm?.value || '',
        tableName: workForm?.name || '',
        tableSchema: sourceTableSchema,
      }}
    >
      <div className="flex-1 flex flex-col" style={{ height: 'calc(100% - 56px)' }}>
        {getConfigForm()}
      </div>
    </FlowTableContext.Provider>
  );
}
