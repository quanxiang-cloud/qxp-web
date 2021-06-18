import React from 'react';
import { isEqual } from 'lodash';

import FormSelector from '@c/form-table-selector';
import useObservable from '@lib/hooks/use-observable';

import FormDataForm from './form-data';
import ApproveForm from './intermidiate/approve';
import ProcessVariableAssignmentConfig from './process-variable-assignment-config';
import { mergeDataAdapter } from '../utils';
import store from '@flow/detail/content/editor/store';
import type {
  NodeType, StoreValue, TriggerCondition, TriggerConditionValue, BusinessData, NodeWorkForm,
  FormDataData, FillInData,
} from '@flow/detail/content/editor/type';

import FlowTableContext from './flow-source-table';

interface Props {
  nodeType: NodeType;
  value: BusinessData;
  onChange: React.Dispatch<React.SetStateAction<BusinessData>>;
  onWorkTableChange: React.Dispatch<React.SetStateAction<{
    name?: string;
    value: string;
  } | undefined>>;
  toggleFormDataChanged: React.Dispatch<React.SetStateAction<boolean>>;
  // todo refactor this prop define
  form?: NodeWorkForm;
}

export default function Form({
  nodeType,
  value,
  onChange,
  onWorkTableChange,
  toggleFormDataChanged,
  form,
}: Props): JSX.Element {
  const { validating } = useObservable<StoreValue>(store);
  const isApproveNode = nodeType === 'approve';
  const isFillInNode = nodeType === 'fillIn';

  function updateFormData<T>(path: string, updater: (v: T) => T): void {
    onChange(mergeDataAdapter(value, path, updater));
  }

  function onWorkFormChange(formValue: NodeWorkForm): void {
    const v = (value as FormDataData).form.value;
    const isWorkFormChanged = v && v !== formValue.value;
    if (isWorkFormChanged) {
      return onWorkTableChange(formValue);
    }
    toggleFormDataChanged(true);
    updateFormData('form', () => formValue);
  }

  function isTriggerConditionValueEmpty(condition: TriggerCondition): boolean {
    const { expr = [] } = condition;
    const exprValue = expr[0] as TriggerConditionValue;
    return !exprValue?.key && !exprValue?.op && !exprValue?.value;
  }

  function onFormChange(nodeForm: Partial<BusinessData>): void {
    const oldData = value as FormDataData;
    const newData = { ...value, ...nodeForm } as FormDataData;
    const isChanged = !isEqual(oldData, newData);
    toggleFormDataChanged(isChanged);
    onChange((f) => ({ ...f, ...nodeForm }));
    if (nodeType !== 'formData' || !oldData.triggerCondition) {
      return;
    }
    const { triggerCondition: { op: oldOp, expr: oldExpr } } = oldData;
    const { triggerCondition: { op: newOp, expr: newExpr } } = newData;
    if (oldOp === '' && newOp === '' && !newExpr.length && oldExpr.length === 1 &&
      isTriggerConditionValueEmpty(oldExpr[0] as TriggerCondition)) {
      toggleFormDataChanged(false);
    }
  }

  const approveFormVisible = (isApproveNode || isFillInNode) && (value as FillInData).basicConfig;
  const isFormDataNode = nodeType === 'formData';
  const formDataValue = value as FormDataData;
  const formDataFormVisible = isFormDataNode && formDataValue.form && formDataValue.triggerWay;

  return (
    <FlowTableContext.Provider value={{ tableID: form?.value || '', tableName: form?.name || '' }}>
      <div className="flex-1" style={{ height: 'calc(100% - 56px)' }}>
        {form && (
          <FormSelector
            value={form}
            onChange={onWorkFormChange}
            changeable={isFormDataNode}
            validating={validating}
          />
        )}
        {formDataFormVisible && (
          <FormDataForm
            formID={formDataValue.form.value}
            value={formDataValue}
            onChange={onFormChange}
          />
        )}
        {approveFormVisible && (
          <ApproveForm
            value={value as FillInData}
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
