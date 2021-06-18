import React from 'react';
import { isEqual } from 'lodash';

import FormSelector from '@c/form-table-selector';
import useObservable from '@lib/hooks/use-observable';

import FormDataForm from './form-data';
import ApproveForm from './intermidiate/approve';
import ProcessVariableAssignmentConfig from './process-variable-assignment-config';
import store, { getFormDataElement } from '@flow/detail/content/editor/store';
import type {
  NodeType, StoreValue, TriggerCondition, TriggerConditionValue, NodeWorkForm, Data, BusinessData,
  FormDataData,
} from '@flow/detail/content/editor/type';

import FlowTableContext from './flow-source-table';

interface Props {
  nodeType: NodeType;
  value: Data;
  onChange: React.Dispatch<React.SetStateAction<Data>>;
  toggleFormDataChanged: React.Dispatch<React.SetStateAction<boolean>>;
  // todo refactor this prop define
  form?: NodeWorkForm;
}

export default function Form({
  nodeType,
  value,
  onChange,
  toggleFormDataChanged,
  form,
}: Props): JSX.Element {
  const { validating } = useObservable<StoreValue>(store);
  const formDataElement = getFormDataElement();
  const isApproveNode = nodeType === 'approve';
  const isFillInNode = nodeType === 'fillIn';

  function onWorkFormChange(formValue: NodeWorkForm): void {
    toggleFormDataChanged(!!form?.value && (form?.value !== formValue?.value));
    onFormChange({ form: formValue });
  }

  function isTriggerConditionValueEmpty(condition: TriggerCondition): boolean {
    const { expr = [] } = condition;
    const exprValue = expr[0] as TriggerConditionValue;
    return !exprValue?.key && !exprValue?.op && !exprValue?.value;
  }

  function onFormChange(nodeForm: Partial<BusinessData>): void {
    const oldData = value.businessData;
    const newData = { ...oldData, ...nodeForm };
    const isChanged = !isEqual(oldData, newData);
    toggleFormDataChanged(isChanged);
    onChange((f) => ({ ...f, businessData: { ...f.businessData, ...nodeForm } }) as Data);

    if (nodeType !== 'formData' || !(oldData as FormDataData).triggerCondition) {
      return;
    }
    const { triggerCondition: { op: oldOp, expr: oldExpr } } = oldData as FormDataData;
    const { triggerCondition: { op: newOp, expr: newExpr } } = newData as FormDataData;
    if (oldOp === '' && newOp === '' && !newExpr.length && oldExpr.length === 1 &&
      isTriggerConditionValueEmpty(oldExpr[0] as TriggerCondition)) {
      toggleFormDataChanged(false);
    }
  }

  let approveFormVisible = false;
  if (value.type === 'fillIn') {
    approveFormVisible = !!((isApproveNode || isFillInNode) && value.businessData.basicConfig);
  }
  const isFormDataNode = nodeType === 'formData';
  const formDataValue = value.type === 'formData' ? value.businessData : undefined;
  const formDataFormVisible = isFormDataNode && form && formDataValue?.triggerWay;

  return (
    <FlowTableContext.Provider value={{ tableID: form?.value || '', tableName: form?.name || '' }}>
      <div className="flex-1" style={{ height: 'calc(100% - 56px)' }}>
        {form && (
          <FormSelector
            value={form}
            onChange={onWorkFormChange}
            changeable={isFormDataNode && !formDataElement?.data?.businessData?.form?.value}
            validating={validating}
          />
        )}
        {formDataFormVisible && formDataValue && (
          <FormDataForm
            formID={form?.value}
            value={formDataValue}
            onChange={onFormChange}
          />
        )}
        {approveFormVisible && value.type === 'fillIn' && (
          <ApproveForm
            value={value.businessData}
            onChange={onFormChange}
            nodeType={nodeType}
          />
        )}
        {nodeType === 'processVariableAssignment' && (
          <ProcessVariableAssignmentConfig />
        )}
      </div>
    </FlowTableContext.Provider>
  );
}
