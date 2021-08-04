import React, { useState, useEffect, useContext, useRef } from 'react';
import { isEqual } from 'lodash';

import useObservable from '@lib/hooks/use-observable';
import usePrevious from '@lib/hooks/use-previous';
import FlowContext from '@flow/flow-context';
import type {
  StoreValue, BusinessData, Data, NodeWorkForm,
} from '@flowEditor/type';
import store, {
  getNodeElementById,
  updateStore,
  updateBusinessData,
  getFormDataElement,
  buildWorkFlowSaveData,
  toggleNodeForm,
} from '@flowEditor/store';

import Form from './form';
import useSave from './hooks/use-save';
import Drawer from './drawer';

const drawerTitleMap = {
  formData: '工作表触发',
  fillIn: '填写',
  approve: '审批',
  end: '结束',
  processBranch: '分支',
  processVariableAssignment: '变更流程参数',
  tableDataCreate: '数据新增',
  tableDataUpdate: '数据更新',
  autocc: '抄送',
  email: '发送邮件',
  letter: '站内信',
  processBranchSource: '分流',
  processBranchTarget: '合流',
};

export default function NodeFormWrapper(): JSX.Element | null {
  const { nodeIdForDrawerForm, id, name, elements } = useObservable<StoreValue>(store);
  const { appID } = useContext(FlowContext);
  const currentNodeElement = getNodeElementById(nodeIdForDrawerForm);
  const formDataElement = getFormDataElement();
  const [formData, setFormData] = useState<Data>(currentNodeElement?.data);
  const formDataChangedRef = useRef<boolean>(false);

  const saver = useSave(appID, id);

  const { type: nodeType } = currentNodeElement ?? {};

  useEffect(() => {
    currentNodeElement?.data && setFormData(currentNodeElement.data);
  }, [currentNodeElement?.data]);

  useEffect(() => {
    updateStore((s) => ({ ...s, validating: false }));
    setFormDataChanged(false);
  }, [nodeIdForDrawerForm]);

  const previousNodeID = usePrevious(currentNodeElement?.id) ?? '';
  function setFormDataChanged(formDataChanged: boolean): void {
    formDataChangedRef.current = formDataChanged;
    formDataChanged && updateStore((s) => ({ ...s, saved: false }));
    updateStore((s) => {
      const nodeID = currentNodeElement?.id || previousNodeID;
      if (formDataChanged) {
        s.errors.dataNotSaveMap.set(nodeID, true);
      } else {
        s.errors.dataNotSaveMap.delete(nodeID);
      }
      return { ...s, errors: s.errors };
    });
  }

  function handleChange(newFormData: BusinessData): void {
    updateStore((s) => ({ ...s, validating: false }));
    setFormDataChanged(!isEqual(newFormData, formData.businessData));
  }

  const previousName = usePrevious(name);
  function saveWorkFlow(data: BusinessData): void {
    if (!name || !previousName || !elements?.length) {
      return;
    }
    saver(buildWorkFlowSaveData(appID, data), () => {
      setFormDataChanged(false);
      updateBusinessData(nodeIdForDrawerForm, (b) => ({ ...b, ...data }), { saved: true });
      closePanel();
    });
  }

  function onSubmit(data: BusinessData): void {
    saveWorkFlow(data);
  }

  function closePanel(): void {
    if (formDataChangedRef.current) {
      return updateStore((s) => ({
        ...s,
        showDataNotSaveConfirm: true,
        currentDataNotSaveConfirmCallback: () => toggleNodeForm(''),
      }));
    }
    toggleNodeForm('');
  }

  if (!currentNodeElement || !formData) {
    return null;
  }

  function getWorkFormValue(): NodeWorkForm {
    if (formData.type === 'formData') {
      return formData.businessData.form;
    }

    return formDataElement.data.businessData.form;
  }

  return (
    <Drawer
      title={(
        <span className="text-h5 mr-8">
          {currentNodeElement.data.nodeData.name || drawerTitleMap[nodeType]}
        </span>
      )}
      distanceTop={0}
      onCancel={() => toggleNodeForm('')}
      className="flow-editor-drawer"
    >
      <div className="flex-1 flex flex-col justify-between h-full">
        <Form
          workForm={getWorkFormValue()}
          defaultValue={formData}
          onSubmit={onSubmit}
          onCancel={closePanel}
          onChange={handleChange}
        />
      </div>
    </Drawer>
  );
}
