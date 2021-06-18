import React, { useState, MouseEvent, useEffect } from 'react';

import Drawer from '@c/drawer';
import useObservable from '@lib/hooks/use-observable';
import usePrevious from '@lib/hooks/use-previous';
import { jsonValidator } from '@lib/utils';
import type {
  StoreValue, BusinessData, TriggerCondition, TriggerConditionValue,
  TimeRule, NodeType, TriggerWay, Data,
} from '@flow/detail/content/editor/type';
import SaveButtonGroup
  from '@flow/detail/content/editor/components/_common/action-save-button-group';
import store, {
  getNodeElementById,
  updateStore,
  updateBusinessData,
  getFormDataElement,
  buildWorkFlowSaveData,
} from '@flow/detail/content/editor/store';

import Form from './form';

import useSave from './hooks/use-save';
import FlowContext from '../../../flow-context';
import { useContext } from 'react';

const drawerTitleMap = {
  formData: '工作表触发',
  fillIn: '填写',
  approve: '审批',
  end: '结束',
  processBranch: '分支',
  processVariableAssignment: '变更流程参数',
  tableDataCreate: '数据新增',
  tableDataUpdate: '数据更新',
  cc: '抄送',
  sendEmail: '发送邮件',
  webMessage: '站内信',
};

export default function NodeFormWrapper(): JSX.Element | null {
  const {
    nodeIdForDrawerForm, id, status, name, elements,
  } = useObservable<StoreValue>(store);
  const { appID } = useContext(FlowContext);
  const currentNodeElement = getNodeElementById(nodeIdForDrawerForm);
  const formDataElement = getFormDataElement();
  const [formData, setFormData] = useState<Data>(currentNodeElement?.data);
  const [formDataChanged, setFormDataChanged] = useState(false);
  const saver = useSave(appID, id);

  const { type: nodeType } = currentNodeElement ?? {};

  useEffect(() => {
    currentNodeElement?.data && setFormData(currentNodeElement.data);
  }, [currentNodeElement?.data]);

  useEffect(() => {
    formDataChanged && updateStore((s) => ({ ...s, saved: false }));
  }, [formDataChanged]);

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

  function triggerConditionValidator(v: TriggerCondition): boolean {
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

  function timeRuleValidator(timeRule: TimeRule): boolean {
    const { deadLine, whenTimeout } = timeRule ?? {};
    if (timeRule?.enabled) {
      if (
        ((whenTimeout?.type === 'jump' || whenTimeout?.type === 'autoDealWith') &&
        !whenTimeout?.value) || !deadLine?.breakPoint.length) {
        return false;
      }

      return !!(timeRule.deadLine.day || timeRule.deadLine.hours || timeRule.deadLine.minutes);
    }
    return true;
  }

  function triggerWayValidator([triggerWay, whenAlterFields]: [TriggerWay, string[]]): boolean {
    const isTriggerWayValid = !!triggerWay?.length && typeof triggerWay !== 'undefined';
    if (triggerWay?.length && triggerWay?.includes('whenAlter') && !whenAlterFields?.length) {
      return false;
    }
    return isTriggerWayValid;
  }

  function multiplePersonWayValidator(way: string): boolean {
    if (formData.type === 'fillIn') {
      const { users, departments } = formData.businessData.basicConfig.approvePersons;
      if (users.length === 1 && !departments.length) {
        return true;
      }
    }
    return !!way;
  }

  function formDataIsValid(): boolean {
    const jsonValidatorMap: Record<NodeType, Record<string, (v: any) => boolean>> = {
      formData: {
        'form.value': (v) => !!v && typeof v !== 'undefined',
        'triggerWay,whenAlterFields': triggerWayValidator,
        triggerCondition: triggerConditionValidator,
      },
      fillIn: {
        'basicConfig.timeRule': timeRuleValidator,
        'basicConfig.multiplePersonWay': multiplePersonWayValidator,
      },
      approve: {
        'basicConfig.timeRule': timeRuleValidator,
        'basicConfig.multiplePersonWay': multiplePersonWayValidator,
      },
      end: {},
      processBranch: {},
      processVariableAssignment: {},
      tableDataCreate: {},
      tableDataUpdate: {},
      cc: {},
      sendEmail: {},
      webMessage: {},
    };
    return jsonValidator<BusinessData>(formData.businessData, jsonValidatorMap[nodeType]);
  }

  const previousName = usePrevious(name);
  function saveWorkFlow(): void {
    if (!name || !previousName || !elements?.length) {
      return;
    }
    const saveData = formData.businessData || {};
    saver(buildWorkFlowSaveData(appID, saveData), () => {
      updateBusinessData(nodeIdForDrawerForm, (b) => ({ ...b, ...saveData }), { saved: true });
      closePanel();
    });
  }

  function onSubmit(e: MouseEvent<HTMLDivElement>): void {
    e.preventDefault();
    if (formDataIsValid()) {
      setFormDataChanged(false);
      saveWorkFlow();
    } else {
      updateStore((s) => ({ ...s, validating: true }));
    }
  }

  function closePanel(): void {
    updateStore((s) => ({
      ...s,
      nodeIdForDrawerForm: s.nodeIdForDrawerForm === 'components' ? s.nodeIdForDrawerForm : '',
      showDataNotSaveConfirm: false,
      errors: {
        ...s.errors,
        dataNotSaveMap: new Map(),
      },
    }));
  }

  function onCancel(): false | undefined {
    if (formDataChanged && (status !== 'ENABLE')) {
      updateStore((s) => ({
        ...s,
        showDataNotSaveConfirm: true,
        currentDataNotSaveConfirmCallback: () => closePanel(),
      }));
      return false;
    }
    closePanel();
  }

  if (!currentNodeElement || !formData) {
    return null;
  }

  const formValue = formData.type === 'formData' ? formData.businessData.form :
    formDataElement.data.businessData.form;

  return (
    <Drawer
      title={(<span className="text-h5 mr-8">{drawerTitleMap[nodeType]}</span>)}
      distanceTop={0}
      onCancel={closePanel}
      className="flow-editor-drawer"
    >
      <div className="flex-1 flex flex-col justify-between h-full">
        <Form
          nodeType={nodeType}
          form={formValue}
          value={formData}
          onChange={setFormData}
          toggleFormDataChanged={setFormDataChanged}
        />
        <SaveButtonGroup onSave={onSubmit} onCancel={onCancel} />
      </div>
    </Drawer>
  );
}
