import React, { JSXElementConstructor } from 'react';

import type { NodeWorkForm, Data, BusinessData } from '@flowEditor/type';

import FormDataForm from './form-data';
import ApproveForm from './intermidiate/approve';
import ProcessVariableAssignmentConfig from './process-variable-assignment-config';
import FlowTableContext from './flow-source-table';
import CreateTableData from './create-table-data';

interface Props {
  workForm: NodeWorkForm;
  defaultValue: Data;
  onSubmit: (data: BusinessData) => void;
  onCancel: () => void;
}

function Placeholder(): JSX.Element | null {
  return null;
}

const components: Record<string, JSXElementConstructor<any>> = {
  formData: FormDataForm,
  approve: ApproveForm,
  fillIn: ApproveForm,
  processBranch: Placeholder,
  processVariableAssignment: ProcessVariableAssignmentConfig,
  tableDataCreate: CreateTableData,
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

  return (
    <FlowTableContext.Provider
      value={{ tableID: workForm?.value || '', tableName: workForm?.name || '' }}
    >
      <div className="flex-1" style={{ height: 'calc(100% - 56px)' }}>
        {getConfigForm()}
      </div>
    </FlowTableContext.Provider>
  );
}
