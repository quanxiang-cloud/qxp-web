import React, { JSXElementConstructor, useEffect, useState, useContext, useMemo } from 'react';
import { useQuery } from 'react-query';

import { getTableSchema } from '@lib/http-client-form';
import type { NodeWorkForm, Data, BusinessData } from '@flow/content/editor/type';
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
import Delayed from './timer-start';
import ProcessBranchTarget from './process-branch-target';
import WebHookConfig from './webhook';
import FillInForm from './intermidiate/fillIn';

interface Props {
  workForm: NodeWorkForm | string
  defaultValue: Data;
  onSubmit: (data: BusinessData) => void;
  onCancel: () => void;
  onChange: (data: BusinessData) => void;
}

function useTableSchema(
  appID: string,
  formData: string | NodeWorkForm,
): [ReturnType<typeof schemaToFields>, boolean] {
  const [schema, setSchema] = useState<ISchema>();
  const tableID = (formData as NodeWorkForm)?.value || undefined;
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

  const schemaFields = useMemo(() => schemaToFields(schema), [schema]);

  return [schemaFields, isLoading];
}

const components: Record<string, JSXElementConstructor<any>> = {
  formData: FormDataForm,
  approve: ApproveForm,
  fillIn: FillInForm,
  processBranch: ProcessBranch,
  processBranchTarget: ProcessBranchTarget,
  processVariableAssignment: ProcessVariableAssignmentConfig,
  tableDataCreate: CreateTableData,
  FORM_TIME: Delayed,
  email: SendEmailConfig,
  autocc: CopyTo,
  letter: WebMessage,
  tableDataUpdate: UpdateTableData,
  webhook: WebHookConfig,
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
  const [sourceTableSchema, isLoading] = useTableSchema(appID, workForm);

  if (isLoading) {
    // todo handle error case
    return (<div>loading...</div>);
  }

  // this a patch.
  // When creating work flow, selecting working-table should be the first step, nothing else.
  // All nodes in flow requires working-table, except the start node.
  if (defaultValue.type === 'formData') {
    return (
      <FlowTableContext.Provider
        value={{
          tableID: (workForm as NodeWorkForm)?.value || '',
          tableName: (workForm as NodeWorkForm)?.name || '',
          tableSchema: sourceTableSchema,
        }}
      >
        <div className="flex-1 flex flex-col" style={{ height: 'calc(100% - 56px)' }}>
          {getConfigForm()}
        </div>
      </FlowTableContext.Provider>
    );
  }
  if (!sourceTableSchema.length && typeof workForm !== 'string') {
    return (<div>loading...</div>);
  }
  return (
    <FlowTableContext.Provider
      value={{
        tableID: (workForm as NodeWorkForm)?.value || '',
        tableName: (workForm as NodeWorkForm)?.value || '',
        tableSchema: sourceTableSchema,
      }}
    >
      <div className="flex-1 flex flex-col" style={{ height: 'calc(100% - 56px)' }}>
        {getConfigForm()}
      </div>
    </FlowTableContext.Provider>
  );
}
