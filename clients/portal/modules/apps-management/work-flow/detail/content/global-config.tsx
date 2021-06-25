import React, { useEffect, useRef, useContext } from 'react';
import { useQuery } from 'react-query';

import Toggle from '@c/toggle';
import Icon from '@c/icon';
import ToolTip from '@c/tooltip';
import Loading from '@c/loading';
import useObservable from '@lib/hooks/use-observable';
import toast from '@lib/toast';
import CheckBoxGroup from '@c/checkbox/checkbox-group';
import FormulaEditor, { RefProps } from '@c/formula-editor';
import { getFormFieldSchema } from '@flowEditor/forms/api';

import store, {
  updateStoreByKey,
  updateStore,
  buildWorkFlowSaveData,
  getFormDataElement,
} from './editor/store';
import useSave from './editor/forms/hooks/use-save';
import { getFlowVariables } from './editor/forms/api';
import type { StoreValue } from './editor/type';
import FlowContext from '../flow-context';

export default function GlobalConfig(): JSX.Element | null {
  const {
    cancelable,
    urgeable,
    seeStatusAndMsg,
    nodeAdminMsg,
    id,
    name,
    triggerMode,
    status,
    keyFields,
    instanceName,
  } = useObservable<StoreValue>(store);
  const formulaEditorRef = useRef<RefProps>();
  const { appID, flowID } = useContext(FlowContext);
  const formDataElement = getFormDataElement();
  const changedRef = useRef<{ key: keyof StoreValue, checked: boolean }>();
  const { data: fieldList, isLoading } = useQuery(
    ['GET_FIELD_LIST', formDataElement.data.businessData.form.value, appID],
    ({ queryKey }) => {
      return getFormFieldSchema({ queryKey }).then((schema) => {
        return Object.entries(schema.properties || {}).filter(([key]) => {
          return key !== '_id';
        }).map(([key, field]) => {
          return {
            label: field.title,
            value: key,
          };
        });
      });
    },
    { refetchOnWindowFocus: false },
  );

  const { data: variables, isLoading: varLoading } = useQuery(
    ['GET_VARIABLES'],
    () => {
      return getFlowVariables(flowID).then((vars) => {
        return vars.map(({ code, name }) => ({
          key: code,
          name,
        }));
      });
    },
    { refetchOnWindowFocus: false },
  );

  const saver = useSave(appID, id);
  useEffect(() => {
    if (!changedRef.current?.key || !name || !triggerMode) {
      return;
    }
    saver(buildWorkFlowSaveData(appID),
      () => updateStore((s) => ({ ...s, saved: true })),
      () => changedRef.current?.key && updateStoreByKey(
        changedRef.current?.key,
        () => !changedRef.current?.checked,
      ));
  }, [changedRef.current]);

  const addVar = (variable: { name: string, key: string }): void => {
    formulaEditorRef.current?.insertEntity(variable);
  };

  const handleBlur = (instanceName: string): void => {
    saver(
      { ...buildWorkFlowSaveData(appID), instanceName },
      () => updateStore((s) => ({ ...s, instanceName })),
    );
  };

  const handleAbstractChange = (value: (string | number)[]): void => {
    const keyFields = value.join(',');
    saver({ ...buildWorkFlowSaveData(appID), keyFields }, () => updateStore((s) => ({ ...s, keyFields })));
  };

  const options = [{
    field: 'cancelable',
    title: '流程发起后允许撤回',
    desc: '流程发起后允许撤回',
    subTitle: '流程发起后允许撤回',
    checked: cancelable,
  }, {
    field: 'urgeable',
    title: '允许工作流发起人催办',
    desc: '允许工作流发起人催办',
    subTitle: '表单元素输入帮助提示，表单元素输入帮助提示。',
    checked: urgeable,
  }, {
    field: 'seeStatusAndMsg',
    title: '允许查看工作流状态与留言',
    desc: '允许查看工作流状态与留言',
    subTitle: '表单元素输入帮助提示，表单元素输入帮助提示。',
    checked: seeStatusAndMsg,
  }, {
    field: 'nodeAdminMsg',
    title: '允许节点负责人留言',
    desc: '允许节点负责人留言',
    subTitle: '表单元素输入帮助提示，表单元素输入帮助提示。',
    checked: nodeAdminMsg,
  }];

  function onChange(type: keyof StoreValue) {
    return (checked?: boolean) => {
      changedRef.current = { key: type, checked: !!checked };
      updateStoreByKey(type, () => !!checked);
    };
  }

  if (typeof cancelable === 'undefined') {
    return null;
  }

  if (isLoading || varLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full flex-col flex items-center">
      <div
        className="w-full h-56 items-center flex px-20 bg-gray-1000
        shadow-header text-gray-900 mb-20">
        全局配置
      </div>
      {options.map((option) => (
        <section key={option.field} className="bg-white rounded-12 flex p-20 mb-16 w-full max-w-%90">
          <div onClick={() => {
            if (status === 'ENABLE') {
              return toast.error('启用状态的流程无法编辑');
            }
          }}>
            <Toggle
              defaultChecked={option.checked}
              className="mr-16"
              onChange={onChange(option.field as keyof StoreValue)}
              disabled={status === 'ENABLE'}
            />
          </div>
          <div>
            <div className="text-body2-no-color text-gray-600 mb-4 flex items-center">
              <span className="mr-8">{option.title}</span>
              <ToolTip
                inline
                label={option.desc}
                position="top"
                labelClassName="whitespace-nowrap"
              >
                <Icon name="info" />
              </ToolTip>
            </div>
            <span className="text-caption-no-color text-gray-400">
              {option.subTitle}
            </span>
          </div>
        </section>
      ))}
      <section className="bg-white rounded-12 p-20 mb-16 w-full max-w-%90">
        <div className='mb-8'>流程实例标题</div>
        <div>
          {variables?.map((variable) => {
            return (
              <span
                key={variable.key}
                onClick={() => addVar(variable)}
                className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300 cursor-pointer"
              >
                {variable.name}
              </span>
            );
          })}
        </div>
        <FormulaEditor
          ref={formulaEditorRef}
          customRules={variables}
          onBlur={handleBlur}
          className="block border border-gray-600 w-full mb-16"
          defaultValue={instanceName}
        />
      </section>
      <section className="bg-white rounded-12 p-20 mb-16 w-full max-w-%90">
        <div className='mb-8'>流程摘要</div>
        <CheckBoxGroup
          defaultValue={keyFields.split(',')}
          onChange={handleAbstractChange}
          options={fieldList}
        />
      </section>
    </div>
  );
}
