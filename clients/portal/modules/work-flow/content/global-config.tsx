import React, { useRef, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { Radio, RadioChangeEvent } from 'antd';

import Toggle from '@c/toggle';
import Icon from '@c/icon';
import ToolTip from '@c/tooltip';
import Loading from '@c/loading';
import Select from '@c/select';
import TextHeader from '@c/text-header';
import useObservable from '@lib/hooks/use-observable';
import toast from '@lib/toast';
import CheckBoxGroup from '@c/checkbox/checkbox-group';
import Button from '@c/button';
import FormulaEditor, { RefProps } from '@c/formula-editor';
import { getFormFieldSchema } from '@flow/content/editor/forms/api';
import schemaToFields from '@lib/schema-convert';

import store, {
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
    status,
    keyFields,
    instanceName,
    canCancelType,
    canCancelNodes,
  } = useObservable<StoreValue>(store);

  const [instanceNameTmp, setInstanceName] = useState(instanceName || '');
  const { control, handleSubmit, unregister, formState: { errors } } = useForm();
  const formulaEditorRef = useRef<RefProps>();
  const { appID, flowID } = useContext(FlowContext);
  const formDataElement = getFormDataElement();
  const { data: fieldList, isLoading } = useQuery(
    ['GET_FIELD_LIST', formDataElement.data.businessData.form.value, appID],
    async ({ queryKey, meta }) => {
      const schema = await getFormFieldSchema({ queryKey, meta });
      const schemaFields = schemaToFields(schema);
      return schemaFields.filter((fieldSchema) => {
        return fieldSchema.id !== '_id' && !['subtable', 'associatedrecords'].includes(
          fieldSchema.componentName);
      }).map((fieldSchema) => ({
        label: fieldSchema.title,
        value: fieldSchema.id,
      }));
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
  const addVar = (variable: { name: string, key: string }): void => {
    formulaEditorRef.current?.insertEntity(variable);
  };

  const handleCancelTypeChange = (e: RadioChangeEvent): void => {
    const updateData: { canCancelType: number, canCancelNodes?: string } = { canCancelType: e.target.value };
    if (canCancelType !== 3) {
      updateData.canCancelNodes = '';
      unregister('canCancelNodes');
    }

    updateStore((s) => ({ ...s, ...updateData }));
  };

  const handleCanCancelChange = (cancelable: boolean): void => {
    updateStore((s) => ({ ...s, cancelable }));
  };

  const handleSaveConfig = (
    config: Omit<StoreValue, 'elements' | 'errors' | 'currentDataNotSaveConfirmCallback'>,
  ): void => {
    updateStore((s) => ({ ...s, ...config }));
    saver({
      ...buildWorkFlowSaveData(appID),
      keyFields: config.keyFields,
      instanceName: config.instanceName,
      canCancelNodes: config.canCancelNodes,
      canCancelType,
    });
  };

  const approveNodes = store.value.elements.filter(({ type }) => type === 'approve').map((node) => {
    return {
      label: node.data?.nodeData.name,
      value: node.id,
    };
  });

  const WITHDRAW_OPTIONS = [
    {
      label: '仅在下一节点未处理时可撤回',
      value: 1,
    },
    {
      label: '任意节点都可以撤回',
      value: 2,
    },
    {
      label: '指定节点下可撤回',
      value: 3,
      disabled: approveNodes.length === 0,
    },
  ];

  const options = [{
    field: 'cancelable',
    title: '流程发起后允许撤回',
    desc: '流程发起后允许撤回',
    subTitle: cancelable && (
      <div className='mt-16'>
        <div className='flex gap-x-16'>
          <Radio.Group options={WITHDRAW_OPTIONS} onChange={handleCancelTypeChange} value={canCancelType} />
        </div>
        {canCancelType === 3 && (
          <div className='mt-10 text-body2-no-color text-gray-600 flex items-center'>
            <p className='mr-16'><span className='text-red-600'>*</span>指定节点:</p>
            <Controller
              name='canCancelNodes'
              control={control}
              rules={{ required: true }}
              defaultValue={canCancelNodes}
              render={({ field }) => (
                <Select
                  multiple
                  defaultValue={canCancelNodes ? canCancelNodes.split(',') : []}
                  ref={field.ref}
                  onChange={(nodes) => {
                    field.onChange(nodes.length ? nodes.join(',') : '');
                  }}
                  options={approveNodes}
                />
              )}
            />
            {errors.canCancelNodes && <p className='text-red-600 ml-10'>请选择节点</p>}
          </div>
        )}
      </div>
    ),
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

  if (typeof cancelable === 'undefined') {
    return null;
  }

  if (isLoading || varLoading) {
    return <Loading />;
  }

  const spanClass = 'inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300';

  return (

    <div className="m-16 flex-1 mb-0 overflow-auto">
      <div className="h-full flex-1 bg-white rounded-t-12">
        <TextHeader
          title="全局配置"
          itemTitleClassName="text-12 font-semibold"
          desc="设置工作流全局配置"
          actionClassName="text-12"
          // action={<a className="ease-linear underline">📌 &nbsp;快速开始？</a>}
          className="bg-gray-1000 p-16 header-background-image h-44 shadow-header rounded-t-12"
          descClassName="text-gray-400"
        />
        <form onSubmit={handleSubmit(handleSaveConfig)} className='p-16'>
          {options.map((option) => (
            <div key={option.field} className='mb-16'>
              <div
                className='flex'
                onClick={() => {
                  if (status === 'ENABLE') {
                    return toast.error('启用状态的流程无法编辑');
                  }
                }}>
                <div className="text-body2-no-color text-gray-600 mb-4 flex items-center">
                  <span className="mr-8">{option.title}</span>
                  <ToolTip
                    inline
                    label={option.desc}
                    position="top"
                    labelClassName="whitespace-nowrap"
                  >
                    <Icon name="info" />
                  </ToolTip>：
                </div>
                <Controller
                  name={option.field}
                  control={control}
                  defaultValue={option.checked}
                  render={({ field }) => (
                    <Toggle
                      defaultChecked={option.checked}
                      className="mr-16"
                      onChange={(type) => {
                        option.field === 'cancelable' && handleCanCancelChange(type);
                        field.onChange(type);
                      }}
                      disabled={status === 'ENABLE'}
                    />
                  )
                  }
                />
              </div>
              <div className="text-caption-no-color text-gray-400">
                {option.subTitle}
              </div>
            </div>
          ))}
          <div className='mb-16'>
            <div className='mb-8'>流程实例标题：</div>
            <div>
              {variables?.map((variable) => {
                if (instanceNameTmp.includes(variable.key) || status === 'ENABLE') {
                  return (
                    <span
                      className={`${spanClass} cursor-not-allowed text-gray-300`}
                      key={variable.key}
                    >{variable.name}</span>
                  );
                }

                return (
                  <span
                    key={variable.key}
                    onClick={() => addVar(variable)}
                    className={`${spanClass} cursor-pointer`}
                  >
                    {variable.name}
                  </span>
                );
              })}
            </div>
            <Controller
              name='instanceName'
              control={control}
              render={({ field }) => (
                <FormulaEditor
                  ref={formulaEditorRef}
                  customRules={variables}
                  help=""
                  onChange={(value) => {
                    field.onChange(value);
                    setInstanceName(value);
                  }}
                  className="block mb-16"
                  readOnly={status === 'ENABLE'}
                  defaultValue={instanceName}
                />
              )}
            />
          </div>
          <div className='mb-16'>
            <div className='mb-8'>流程摘要：</div>
            <Controller
              name='keyFields'
              control={control}
              defaultValue={keyFields}
              render={({ field }) => (
                <CheckBoxGroup
                  defaultValue={keyFields ? keyFields.split(',') : []}
                  onChange={(fields) => {
                    const newFields = fieldList?.map(
                      (listItem) => fields.find((item) => item === listItem.value),
                    ).filter(Boolean) || [];
                    field.onChange(newFields.length ? newFields.join(',') : '');
                  }}
                  options={fieldList}
                  disabled={status === 'ENABLE'}
                />
              )}
            />
          </div>
          <div>
            <Button modifier='primary' type='submit'>保存</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
