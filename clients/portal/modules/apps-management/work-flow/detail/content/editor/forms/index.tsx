import React, { useState, FormEvent, useEffect } from 'react';
import { isEqual } from 'lodash';

import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';
import usePrevious from '@lib/hooks/use-previous';
import { jsonValidator } from '@lib/utils';
import type {
  StoreValue, BusinessData, NodeWorkForm, TriggerCondition, TriggerConditionValue,
  TimeRule, NodeType, TriggerWay,
} from '@flow/detail/content/editor/type';
import SaveButtonGroup
  from '@flow/detail/content/editor/components/_common/action-save-button-group';
import store, {
  getNodeElementById,
  updateStore,
  updateBusinessData,
} from '@flow/detail/content/editor/store';

import FormSelector from './intermidiate/components/form-selector';
import FormDataForm from './form-data';
import ApproveForm from './intermidiate/approve';
import { getNodeInitialData, mergeDataAdapter } from '../utils';

export default function NodeFormWrapper() {
  const { nodeIdForDrawerForm, validating } = useObservable<StoreValue>(store);
  const currentNodeElement = getNodeElementById(nodeIdForDrawerForm);
  const data = currentNodeElement?.data?.businessData;
  const [formData, setFormData] = useState<BusinessData>(data);
  const [formDataChanged, setFormDataChanged] = useState(false);

  const { type: nodeType } = currentNodeElement ?? {};
  const isFormDataNode = nodeType === 'formData';
  const isApproveNode = nodeType === 'approve';
  const isFillInNode = nodeType === 'fillIn';

  useEffect(() => {
    setFormData((f) => ({
      ...(data || {}),
      form: data?.form || f?.form,
    }));
  }, [data]);

  useEffect(() => {
    updateStore((s) => ({ ...s, validating: false }));
    setFormDataChanged(false);
  }, [nodeIdForDrawerForm]);

  const previousNodeID = usePrevious(currentNodeElement?.id) ?? '';
  useEffect(() => {
    updateStore((s) => {
      const nodeID = currentNodeElement?.id || previousNodeID;
      if (formDataChanged) {
        s.errors.dataNotSaveMap.set(nodeID, true);
      } else {
        s.errors.dataNotSaveMap.delete(nodeID);
      }
      return { ...s, errors: s.errors };
    });
  }, [formDataChanged]);

  function triggerConditionValidator(v: TriggerCondition) {
    let isValid = true;
    v?.expr?.forEach((exprItem) => {
      const valueItem = exprItem as TriggerConditionValue;
      const anotherCondition = exprItem as TriggerCondition;
      if (typeof valueItem.value !== 'undefined') {
        isValid = !!(valueItem.value && valueItem.key && valueItem.op);
      } else {
        isValid = triggerConditionValidator(anotherCondition);
      }
    });
    return isValid;
  }

  function timeRuleValidator(timeRule: TimeRule) {
    if (timeRule?.enabled) {
      if (timeRule.whenTimeout.type === 'jump' && !timeRule.whenTimeout.value) {
        return false;
      }

      return !!(timeRule.deadLine.day && timeRule.deadLine.hours && timeRule.deadLine.minutes);
    }
    return true;
  }

  function triggerWayValidator([triggerWay, whenAlterFields]: [TriggerWay, string[]]) {
    const isTriggerWayValid = !!triggerWay?.length && typeof triggerWay !== 'undefined';
    if (triggerWay?.length && triggerWay?.includes('whenAlter') && !whenAlterFields?.length) {
      return false;
    }
    return isTriggerWayValid;
  }

  function formDataIsValid() {
    const jsonValidatorMap: Record<NodeType, Record<string, (v: any) => boolean>> = {
      formData: {
        'form.value': (v) => !!v && typeof v !== 'undefined',
        'triggerWay,whenAlterFields': triggerWayValidator,
        triggerCondition: triggerConditionValidator,
      },
      fillIn: {
        'basicConfig.timeRule': timeRuleValidator,
      },
      approve: {
        'basicConfig.timeRule': timeRuleValidator,
      },
      end: {},
    };
    return jsonValidator<BusinessData>(formData, jsonValidatorMap[nodeType]);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { form, ...saveData } = formData;
    if (isFormDataNode) {
      Object.assign(saveData, { form });
    }
    if (formDataIsValid()) {
      setFormDataChanged(false);
      updateBusinessData(nodeIdForDrawerForm, (b) => ({ ...b, ...saveData }));
      closePanel();
    } else {
      updateStore((s) => ({ ...s, validating: true }));
    }
  }

  function updateFormData<T>(path: string, updater: (v: T) => T) {
    setFormData(mergeDataAdapter(formData, path, updater));
  }

  function closePanel() {
    updateStore((s) => ({ ...s, nodeIdForDrawerForm: '' }));
  }

  function onCancel() {
    if (formDataChanged) {
      updateStore((s) => ({
        ...s,
        showDataNotSaveConfirm: true,
        currentDataNotSaveConfirmCallback: () => closePanel(),
      }));
      return false;
    } else {
      closePanel();
    }
  }

  function onWorkFormChange(formValue: NodeWorkForm) {
    setFormDataChanged(!isEqual(formData, { ...formData, form: formValue }));
    updateFormData('form', () => formValue);
  }

  function isTriggerConditionValueEmpty(condition: TriggerCondition) {
    const { expr = [] } = condition;
    const exprValue = expr[0] as TriggerConditionValue;
    return !exprValue?.key && !exprValue?.op && !exprValue?.value;
  }

  function onFormChange(nodeForm: Partial<BusinessData>) {
    const oldData = formData;
    const newData = { ...formData, ...nodeForm };
    const isChanged = !isEqual(oldData, newData);
    setFormDataChanged(isChanged);
    setFormData((f) => ({ ...f, ...nodeForm }));
    if (nodeType !== 'formData') {
      return;
    }
    const { triggerCondition: { op: oldOp, expr: oldExpr } } = oldData;
    const { triggerCondition: { op: newOp, expr: newExpr } } = newData;
    if (oldOp === '' && newOp === '' && !newExpr.length && oldExpr.length === 1 &&
      isTriggerConditionValueEmpty(oldExpr[0] as TriggerCondition)) {
      setFormDataChanged(false);
    }
  }

  function onResetFormData(form: NodeWorkForm) {
    // TODO
    const newInitialFormData = getNodeInitialData(currentNodeElement?.type);
    newInitialFormData && setFormData({
      ...newInitialFormData,
      form,
    });
  }

  const drawerTitleMap = {
    formData: '工作表触发',
    fillIn: '填写',
    approve: '审批',
    end: '结束',
  };

  if (!currentNodeElement || !formData) {
    return null;
  }
  const approveFormVisible = (isApproveNode || isFillInNode) && formData.basicConfig;
  const formDataFormVisible = isFormDataNode && formData.form && formData.triggerWay;

  return (
    <Drawer
      title={(
        <span className="text-h5 mr-8">{drawerTitleMap[nodeType]}</span>
      )}
      distanceTop={0}
      onCancel={onCancel}
      className="flow-editor-drawer"
    >
      <form
        onSubmit={onSubmit}
        className="flex-1 flex flex-col justify-between h-full"
      >
        <div className="flex-1" style={{ height: 'calc(100% - 56px)' }}>
          {formData.form && (
            <FormSelector
              value={formData.form}
              onChange={onWorkFormChange}
              onResetFormData={onResetFormData}
              changeable={isFormDataNode}
              validating={validating}
            />
          )}
          {formDataFormVisible && (
            <FormDataForm
              formID={formData.form.value}
              value={formData}
              onChange={onFormChange}
            />
          )}
          {approveFormVisible && (
            <ApproveForm
              value={formData}
              onChange={onFormChange}
              nodeType={nodeType}
            />
          )}
        </div>
        <SaveButtonGroup onCancel={closePanel} />
      </form>
    </Drawer>
  );
}
