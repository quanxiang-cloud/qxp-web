/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useUpdateEffect } from 'react-use';
import { get } from 'lodash';

import Select from '@c/select';
import Toggle from '@c/toggle';
import SaveButtonGroup from '@newFlow/content/editor/components/_common/action-save-button-group';
import { getFormDataMenuList } from '@c/form-table-selector/api';
import FlowContext from '@newFlow/flow-context';
import toast from '@lib/toast';
import Modal from '@c/modal';
import { BusinessData, StoreValue, TableDataCreateData } from '@newFlow/content/editor/type';
import { ValueRuleVal } from '@newFlow/content/editor/type';
import FlowTableContext from '@newFlow/content/editor/forms/flow-source-table';

import TargetTableFields from './target-table-fields';
import Context from './context';
import store from '../../store';
import useObservable from '@lib/hooks/use-observable';
import { getElementParents } from '../webhook/utils';
import { getFieldSchema } from '../api';
import schemaToFields from '@lib/schema-convert';

interface Props {
  defaultValue: TableDataCreateData;
  onSubmit: (data: BusinessData) => void;
  onChange: (data: BusinessData) => void;
  onCancel: () => void;
  currentNodeElement?: any;
}

const initialValue = {
  targetTableId: '',
  silent: true,
  createRule: {},
  ref: {},
  queryNodeId: '',
};

function FormCreateTableData({ defaultValue, onSubmit, onCancel, onChange: _onChange, currentNodeElement }: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const { tableID } = useContext(FlowTableContext);
  const [value, setValue] = useState<TableDataCreateData| any>(defaultValue || {});
  const [nextTable, setNextTable] = useState<string>('');
  const [switchTableModal, setSwitchTableModal] = useState(false);

  const [showError, setShowError] = useState(false);

  const { elements = [] } = useObservable<StoreValue>(store);
  const [nodesOutputOptions, setNodesOutputOptions] = useState(null);

  const getNodesOutputOptions = ()=>{
    const options: any = [];
    if (elements?.length) {
      const currentElementParents = getElementParents(currentNodeElement);
      const allArr: any = [];
      elements?.forEach(async (item: any)=>{
        // if (item.data?.type === 'approve' && currentElementParents.includes(item.id)) {
        //   const nodeDataName = item?.data?.nodeData?.name;
        //   options?.push({
        //     label: nodeDataName,
        //     value: `$(task.${item?.id}.output.agree`,
        //   });
        // }
        // if (item.data?.type === 'fill' && currentElementParents.includes(item.id)) {
        //   const nodeDataName = item?.data?.nodeData?.name;
        //   options?.push({
        //     label: nodeDataName,
        //     value: `$(task.${item?.id}.output.agree`,
        //   });
        // }
        if (item.data?.type === 'tableDataQuery' && currentElementParents.includes(item.id)) {
          const tableID = item?.data?.businessData?.targetTableId;
          allArr.push(()=>{
            const nodeDataName = item?.data?.nodeData?.name;
            const queryList = item?.data?.businessData?.queryList || [];
            return getFieldSchema({ appID, tableID })
              .then((res: any)=>{
                const schemaFields = schemaToFields(res);
                const normalFields = schemaFields?.filter((fieldSchema) => {
                  return fieldSchema.componentName !== 'subtable';
                }).map((fieldSchema) => ({
                  label: fieldSchema.title,
                  value: fieldSchema.id,
                }));
                queryList?.forEach((child: any)=>{
                  const lable = normalFields?.find((item: any)=>item?.value === child?.value?.[0])?.label;
                  if (lable) {
                    options?.push({
                      label: nodeDataName + '.' + lable,
                      value: `$(task.${item?.id}.output.${child?.queryVal})`,
                      nodeID: item?.id,
                    });
                  }
                });
                return res;
              });
          });
        }
      });

      Promise.all(allArr?.map((item: any)=>item()))
        .then(()=>{
          setNodesOutputOptions(options);
        });
    }
  };

  useEffect( ()=>{
    getNodesOutputOptions();
  }, [elements?.length]);

  useUpdateEffect(() => {
    _onChange(value);
  }, [value]);

  useEffect(()=>{
    const { createRule, ref } = value || {};
    const obj: any = {};
    for (const key in createRule) {
      const item = createRule[key];
      if (item?.valueFrom === 'task.xx.output.xxx' && item?.key) {
        if (obj?.[item?.key]) {
          obj[item?.key] = obj[item?.key] + 1;
        } else {
          obj[item?.key] = 1;
        }
      }
    }
    try {
      for (const key in ref) {
        const createRules = ref[key]?.createRules?.[0] || [];
        for (const k in createRules) {
          const item = createRules[k];
          if (item?.valueFrom === 'task.xx.output.xxx' && item?.key) {
            if (obj?.[item?.key]) {
              obj[item?.key] = obj[item?.key] + 1;
            } else {
              obj[item?.key] = 1;
            }
          }
        }
      }
    } catch (error) {
      console.log('error', error);
    }

    let flag = false;
    for (const key in obj) {
      if (obj[key] > 1) {
        flag = true;
      }
    }
    setShowError(flag);
  }, [value]);

  const {
    data: allTables = [],
    isLoading,
    isError,
  } = useQuery(['GET_WORK_FORM_LIST', appID], () => getFormDataMenuList(appID), {
    enabled: !!appID,
  });

  function validateTips(validateValue: ValueRuleVal): boolean {
    const isNullValue = Array.isArray(validateValue) ? !validateValue.length : !validateValue;
    if (typeof validateValue === 'function' || isNullValue) {
      toast.error('必填项未填写完整');
      return false;
    }
    return true;
  }

  const onSave = (): void => {
    const subTableRequiredField = get(value, 'subTableRequiredField', []);
    const normalRequiredField = get(value, 'normalRequiredField', []);

    for (let index = 0; index < subTableRequiredField.length; index += 1) {
      const subFieldValue = get(value, `ref.${subTableRequiredField[index]}.valueOf`, '');
      if (!validateTips(subFieldValue)) {
        return;
      }
    }

    for (let index = 0; index < normalRequiredField.length; index += 1) {
      const normalFieldValue = get(value, `createRule.${normalRequiredField[index]}.valueOf`, '');
      if (!validateTips(normalFieldValue)) {
        return;
      }
    }

    if (!value.targetTableId) {
      toast.error('请选择目标数据表');
      return;
    }
    if (showError) {
      toast.error('节点输出key不能重复');
      return;
    }

    let isNull = false;
    const { createRule, ref } = value;
    for (const key in createRule) {
      const item = createRule[key];
      if (item?.valueFrom === 'task.xx.output.xxx') {
        if (!item?.key) {
          isNull = true;
        }
      }
    }
    try {
      for (const key in ref) {
        const createRules = ref[key]?.createRules?.[0] || [];
        for (const k in createRules) {
          const item = createRules[k];
          if (item?.valueFrom === 'task.xx.output.xxx') {
            if (!item?.key) {
              isNull = true;
            }
          }
        }
      }
    } catch (error) {
    }
    if (isNull) {
      toast.error('节点输出key不能为空');
      return;
    }
    onSubmit(value);
  };

  const onClose = (): void => {
    onCancel();
  };

  const onChange = (val: Partial<TableDataCreateData>): void => {
    setValue((v) => ({ ...v, ...val }));
  };

  const onChangeTargetTable = (table_id: string): void => {
    if (!value.targetTableId) {
      onChange({ targetTableId: table_id });
      return;
    }
    if (value.targetTableId && table_id !== value.targetTableId) {
      setNextTable(table_id);
      setSwitchTableModal(true);
    }
  };

  const onChangeQueryNodeId = (nodeId: string)=>{
    setValue({ ...value, queryNodeId: nodeId }); // reset value
  };

  if (isLoading) {
    return (
      <div>Loading..</div>
    );
  }

  if (isError) {
    return (
      <div>获取目标表失败</div>
    );
  }

  const isSelfForm = value.targetTableId === tableID;

  const getTableQueryOptions = ()=>{
    const options = elements?.filter((item: any)=>item?.type === 'tableDataQuery')?.map((item: any)=>{
      return {
        label: item?.data?.nodeData?.name,
        value: item?.id,
      };
    }) || [];
    return options;
  };

  return (
    <Context.Provider value={{ data: value, setData: onChange, currentNodeElement, nodesOutputOptions } as any}>
      <div className="flex flex-col overflow-auto flex-1 py-24">
        <div className="inline-flex items-center">
          <span className="text-body mr-10">目标数据表:</span>
          <Select
            options={allTables}
            placeholder="选择数据表"
            value={value.targetTableId}
            onChange={onChangeTargetTable}
          />
        </div>
        {value.targetTableId && (
          <div className="inline-flex items-center mt-10">
            <span className="text-body mr-10">表单数据是否触发工作流执行:</span>
            <Toggle
              onChange={(silent) => {
                onChange({ silent });
              }}
              defaultChecked={value.silent && !isSelfForm}
              disabled={isSelfForm}
            />
            <small className="ml-5 text-caption">新增本表数据时不支持再次触发工作流</small>
          </div>
        )}
        <TargetTableFields
          key={nodesOutputOptions?.length}
          appId={appID}
          tableId={value.targetTableId}
        />
        <SaveButtonGroup onSave={onSave} onCancel={onClose} />
        {switchTableModal && (
          <Modal
            title='切换目标数据表'
            onClose={()=> setSwitchTableModal(false)}
            footerBtns={[
              {
                key: 'cancel',
                text: '取消',
                onClick: () => setSwitchTableModal(false),
              },
              {
                key: 'confirm',
                text: '确认',
                onClick: () => {
                  setSwitchTableModal(false);
                  setValue({ ...initialValue, targetTableId: nextTable }); // reset value
                },
                modifier: 'primary',
              },
            ]}
          >
            <p className="p-20">切换数据表之后数据新增的配置将清空，是否继续？</p>
          </Modal>
        )}
      </div>
    </Context.Provider>
  );
}

export default FormCreateTableData;
