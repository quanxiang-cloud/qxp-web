import React, { useRef, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Radio, RadioChangeEvent } from 'antd';

import Toggle from '@c/toggle';
import Icon from '@c/icon';
import ToolTip from '@c/tooltip';
import Loading from '@c/loading';
import Select from '@c/select';
import TextHeader from '@c/text-header';
import useObservable from '@lib/hooks/use-observable';
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
    ['GET_FIELD_LIST', formDataElement?.data?.businessData?.form?.value || '', appID],
    async ({ queryKey, meta }) => {
      const schema = await getFormFieldSchema({ queryKey, meta });
      const schemaFields = schemaToFields(schema);
      return schemaFields.filter((fieldSchema) => {
        return fieldSchema.id !== '_id' && !['subtable', 'associatedrecords', 'aggregationrecords'].includes(
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
          key: '$' + code,
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

  const handleSaveConfig = (config: Partial<StoreValue>): void => {
    updateStore((s) => ({ ...s, ...config }));
    saver({
      ...buildWorkFlowSaveData(appID),
      keyFields: config.keyFields,
      instanceName: config.instanceName,
      canCancelNodes: config.canCancelNodes,
      canCancelType,
    });
  };

  const approveNodes = store.value.elements.filter(
    ({ type }) => type === 'approve' || type === 'fillIn',
  ).map((node) => {
    return {
      label: node.data?.nodeData.name,
      value: node.id,
    };
  });

  const WITHDRAW_OPTIONS = [
    {
      label: '???????????????????????????????????????',
      value: 1,
    },
    {
      label: '???????????????????????????',
      value: 2,
    },
    {
      label: '????????????????????????',
      value: 3,
      disabled: approveNodes.length === 0,
    },
  ];

  const options = [{
    field: 'cancelable',
    title: '???????????????????????????',
    desc: '?????????????????????????????????????????????????????????????????????????????????',
    subTitle: cancelable && (
      <div className='mt-16'>
        <div className='flex gap-x-16'>
          <Radio.Group
            disabled={status === 'ENABLE'}
            options={WITHDRAW_OPTIONS}
            onChange={handleCancelTypeChange}
            value={canCancelType}
          />
        </div>
        {canCancelType === 3 && (
          <div className='mt-10 text-body2-no-color text-gray-600 flex items-center'>
            <p className='mr-16'><span className='text-red-600'>*</span>????????????:</p>
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
            {errors.canCancelNodes && <p className='text-red-600 ml-10'>???????????????</p>}
          </div>
        )}
      </div>
    ),
    checked: cancelable,
  }, {
    field: 'urgeable',
    title: '??????????????????????????????',
    desc: '????????????????????????????????????????????????????????????????????????????????????????????????',
    subTitle: '???????????????????????????????????????????????????????????????????????????????????????????????????',
    checked: urgeable,
  }, {
    field: 'seeStatusAndMsg',
    title: '????????????????????????????????????',
    desc: '??????????????????????????????????????????????????????????????????',
    subTitle: '?????????????????????????????????????????????????????????????????????',
    checked: seeStatusAndMsg,
  }, {
    field: 'nodeAdminMsg',
    title: '???????????????????????????',
    desc: '????????????????????????????????????????????????',
    subTitle: '???????????????????????????????????????????????????',
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
          title="????????????"
          itemTitleClassName="text-12 font-semibold"
          desc="???????????????????????????"
          actionClassName="text-12"
          // action={<a className="ease-linear underline">???? &nbsp;???????????????</a>}
          className="bg-gray-1000 p-16 header-background-image h-44 shadow-header rounded-t-12"
          descClassName="text-gray-400"
        />
        <form onSubmit={handleSubmit(handleSaveConfig as SubmitHandler<Partial<StoreValue>>)} className='p-16'>
          {options.map((option) => (
            <div key={option.field} className='mb-16'>
              <div className='flex'>
                <div className="text-body2-no-color text-gray-600 mb-4 flex items-center">
                  <span className="mr-8">{option.title}</span>
                  <ToolTip
                    label={option.desc}
                    position="top"
                    labelClassName="whitespace-nowrap"
                  >
                    <Icon name="info" />
                  </ToolTip>???
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
            <div className='mb-8'>?????????????????????</div>
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
            <div className='mb-8'>???????????????</div>
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
            <Button modifier='primary' type='submit' forbidden={status === 'ENABLE'}>??????</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
