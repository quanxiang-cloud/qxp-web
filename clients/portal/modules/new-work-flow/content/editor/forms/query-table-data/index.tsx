/* eslint-disable guard-for-in */
/* eslint-disable no-empty */
/* eslint-disable max-len */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useUpdateEffect } from 'react-use';

import Select from '@c/select';
import SaveButtonGroup from '@newFlow/content/editor/components/_common/action-save-button-group';
import { getFormDataMenuList } from '@c/form-table-selector/api';
import FlowContext from '@newFlow/flow-context';
import toast from '@lib/toast';
import { BusinessData, StoreValue, TableDataCreateData } from '@newFlow/content/editor/type';
import FilterRules, { RefType as FilterRuleRef } from './filter-rules';

import TargetTableFields from './target-table-fields';
import './styles.scss';
import useObservable from '@lib/hooks/use-observable';
import store from '../../store';
import RadioButtonGroup from '@c/radio/radio-button-group';
import { isString } from 'lodash';
import { getNodesOutputOptions } from '@portal/modules/new-work-flow/util';

interface Props {
  defaultValue: TableDataCreateData | any;
  onSubmit: (data: BusinessData) => void;
  onChange: (data: BusinessData) => void;
  onCancel: () => void;
  currentNodeElement?: any;
}

function FormQueryTableData({ defaultValue, currentNodeElement, onSubmit, onCancel, onChange: _onChange }: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const _defaultValue = {
    ...defaultValue,
    formType: defaultValue?.formType || 'others',
  };

  const [value, setValue] = useState<any>(_defaultValue || {});
  const filterRef = useRef<FilterRuleRef>(null);

  const [queryData, setQueryData] = useState(defaultValue?.query || {});
  const [showError, setShowError] = useState(false);
  const [showErrorText, setShowErrorText] = useState('');

  const [nodesOutputOptions, setNodesOutputOptions] = useState(null);
  const { elements } = useObservable<StoreValue>(store);
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
    if (!defaultValue?.formType) {
      setValue({ ...value, formType: 'others' });
    }
  }, []);

  const {
    data: allTables = [],
    isLoading,
    isError,
  } = useQuery(['GET_WORK_FORM_LIST', appID], () => getFormDataMenuList(appID), {
    enabled: !!appID,
  });

  const hasError = ()=>{
    const { queryList = [] } = value || {};
    const obj: any = {};
    let flag = false;
    queryList?.forEach((item: any)=>{
      if (item?.queryVal && item?.value?.length) {
        if (obj?.[item.queryVal]) {
          obj[item.queryVal] += 1;
        } else {
          obj[item.queryVal] = 1;
        }
      }
    });
    for (const key in obj) {
      if (obj[key] > 1) {
        flag = true;
        break;
      }
    }
    return flag;
  };
  const onSave = (): void => {
    if (!value.targetTableId) {
      toast.error('请选择目标数据表');
      return;
    }
    // if (hasError()) {
    //   return;
    // }

    const query = filterRef.current?.getValues();
    const { formType, queryList } = value;
    // if (showError) {
    //   return;
    // }
    try {
      const { size, sizeKey, conditions } = query || {};

      if (queryList?.length === 0) {
        setShowError(true);
        // setShowErrorText('查询字段不能为空');
        toast.error('查询字段不能为空');
        return;
      } else {
        setShowError(false);
        setShowErrorText('');
      }
      if (formType !== 'work-form') {
        if (!size) {
          setShowError(true);
          // setShowErrorText('查询条数不能为空');
          toast.error('查询条数不能为空');
          return;
        } else {
          setShowError(false);
          setShowErrorText('');
        }

        if (isString(size) && size?.includes('.output.') && !sizeKey) {
          setShowError(true);
          // setShowErrorText('查询条数key不能为空');
          toast.error('查询条数key不能为空');

          return;
        } else {
          setShowError(false);
          setShowErrorText('');
        }

        const keyArr: any = [];
        sizeKey && keyArr?.push(sizeKey);
        conditions?.forEach((item: any)=>{
          try {
            if (item?.value?.includes('.output.')) {
              item?.outputKey && keyArr?.push(item?.outputKey);
            }
          } catch (error) {
          }
        });
        if (keyArr?.length !== [...new Set(keyArr)]?.length) {
          setShowError(true);
          // setShowErrorText('节点输出key不能重复');
          toast.error('节点输出key不能重复');
          return;
        } else {
          setShowError(false);
          setShowErrorText('');
        }

        // if (hasNullKey) {
        //   setShowError(true);
        //   // setShowErrorText('筛选条件key值不能为空');
        //   toast.error('筛选条件key值不能为空');
        //   return;
        // } else {
        //   setShowError(false);
        //   setShowErrorText('');
        // }
      }
      const hasNullQueryData = queryList?.find((item: any)=>(!item?.queryVal || !item?.value?.[0]));
      if (hasNullQueryData) {
        setShowError(true);
        // setShowErrorText('查询字段不能为空');
        toast.error('查询字段不能为空');

        return;
      } else {
        setShowError(false);
        setShowErrorText('');
      }

      const obj: any = {};
      let flag = false;
      queryList?.forEach((item: any)=>{
        if (item?.queryVal && item?.value?.length) {
          if (obj?.[item.queryVal]) {
            obj[item.queryVal] += 1;
          } else {
            obj[item.queryVal] = 1;
          }
        }
      });
      for (const key in obj) {
        if (obj[key] > 1) {
          flag = true;
          break;
        }
      }
      if (flag) {
        setShowError(true);
        // setShowErrorText('字段查询值不能重复');
        toast.error('字段查询值不能重复');
        return;
      } else {
        setShowError(false);
        setShowErrorText('');
      }
    } catch (error) {
      console.log('error', error);
    }

    setValue({ ...value, query });
    onSubmit({ ...value, query });
  };

  const onClose = (): void => {
    onCancel();
  };

  const onChangeTargetTable = (table_id: string): void => {
    setValue({ targetTableId: table_id, query: null, queryList: [], formType: 'others' });
    return;
  };

  const handeTargetTableFields = (data: any, ref: any)=>{
    setValue({ ...value, queryList: data, ref });
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
    <div className="flex flex-col overflow-auto flex-1 py-24">
      <div className="inline-flex items-center">
        <span className="text-body mr-10">查询对象:</span>
        <RadioButtonGroup
          listData={[
            { label: '本条数据', value: 'work-form' },
            { label: '其它数据', value: 'others' },
          ]}
          onChange={(v) => {
            const formData = elements?.find((item: any)=>item?.type === 'formData');
            const tableID = formData?.data?.businessData?.form?.value;
            if (v === 'work-form') {
              setValue({ ...value, formType: v, targetTableId: tableID, query: null, queryList: [] });
            } else {
              setValue({ ...value, formType: v, targetTableId: '', query: null, queryList: [] });
            }
          }}
          currentValue={value?.formType}
        />
        {value?.formType !== 'work-form' && (
          <Select
            className='ml-20'
            options={allTables}
            placeholder="选择数据表"
            value={value.targetTableId}
            onChange={onChangeTargetTable}
          />
        )}
      </div>
      {
        value.targetTableId && value?.formType !== 'work-form' &&
         (<FilterRules
           key={nodesOutputOptions?.length}
           appId={appID}
           tableId={value.targetTableId}
           defaultValue={queryData}
           nodesOutputOptions={nodesOutputOptions}
           ref={filterRef}
           onChange={()=>{
             //  const query = filterRef.current?.getValues();
             //  setQueryData(query);
             //  setValue({ ...value, query });
           }}
         />)
      }
      {
        value.targetTableId &&
      (<TargetTableFields
        key={value.targetTableId + value?.formType}
        appId={appID}
        tableId={value.targetTableId}
        nodesOutputOptions={nodesOutputOptions}
        queryDataList={()=>{
          return value?.queryList ? value?.queryList?.map((item: any)=>{
            return {
              ...item,
              value: item?.value?.filter((item: any)=>!!item),
            };
          }) : [];
        }}
        onChange={handeTargetTableFields}
      />)
      }
      {showError && <div className={'text-caption-no-color text-red-600 ml-8'}>{showErrorText}</div>}
      <SaveButtonGroup onSave={onSave} onCancel={onClose} />
    </div>
  );
}

export default FormQueryTableData;
