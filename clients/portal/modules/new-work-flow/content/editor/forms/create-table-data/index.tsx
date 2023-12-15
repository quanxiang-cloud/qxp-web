/* eslint-disable max-len */
/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useUpdateEffect } from 'react-use';
import { get, isString } from 'lodash';

import Select from '@c/select';
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
import { getNodesOutputOptions } from '@portal/modules/new-work-flow/util';

interface Props {
  defaultValue: TableDataCreateData | any;
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
  createNumber: undefined,
  createNumberKey: undefined,
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

  const createNumberRef = useRef<any>(null);

  useEffect( ()=>{
    getNodesOutputOptions({
      elements,
      currentNodeElement,
      appID,
      setNodesOutputOptions,
    });
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
    const createNumberObj = createNumberRef?.current?.getValues();

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
    // if (showError) {
    //   toast.error('节点输出key不能重复');
    //   return;
    // }
    const checkKey = ()=>{
      const { createRule, ref } = value || {};

      const createNumberObj = createNumberRef?.current?.getValues();
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

      // try {
      //   for (const key in ref) {
      //     const createRules = ref[key]?.createRules?.[0] || [];
      //     for (const k in createRules) {
      //       const item = createRules[k];
      //       if (item?.valueFrom === 'task.xx.output.xxx' && item?.key) {
      //         if (obj?.[item?.key]) {
      //           obj[item?.key] = obj[item?.key] + 1;
      //         } else {
      //           obj[item?.key] = 1;
      //         }
      //       }
      //     }
      //   }
      // } catch (error) {
      //   console.log('error', error);
      // }

      // if (isString(createNumberObj?.val) && createNumberObj?.val?.includes('.output.')) {
      //   if (obj?.[createNumberObj?.key]) {
      //     obj[createNumberObj?.key] = obj[createNumberObj?.key] + 1;
      //   } else {
      //     obj[createNumberObj?.key] = 1;
      //   }
      // }

      let flag = false;
      for (const key in obj) {
        if (obj[key] > 1) {
          flag = true;
        }
      }
      if (flag) {
        toast.error('节点输出key不能重复');
        return false;
      }

      let isNull = false;
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
      if (isString(createNumberObj?.val) && createNumberObj?.val?.includes('.output.') && !createNumberObj?.key) {
        isNull = true;
      }
      if (isNull) {
        toast.error('节点输出key不能为空');
        return false;
      }
      return true;
    };

    if (checkKey()) {
      onSubmit({
        ...value,
        createNumber: createNumberObj?.val,
        createNumberKey: createNumberObj?.key,
      });
    }
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
        {/* {value.targetTableId && (
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
        )} */}
        {/* {
          value?.targetTableId &&
          (<CreateNumber
            key={nodesOutputOptions?.length}
            defaultData = {{
              value: defaultValue?.createNumber,
              key: defaultValue?.createNumberKey,
            } || {}}
            nodesOutputOptions={nodesOutputOptions}
            ref = {createNumberRef}
          />)
        } */}

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
