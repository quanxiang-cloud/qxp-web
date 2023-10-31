import React, { useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { get, isArray, set } from 'lodash';
import cs from 'classnames';

import Select from '@c/select';
import Button from '@c/button';

import { Select as AntSelect, Input } from 'antd';

import FormulaModal from './formula-modal';
import FlowSourceTableContext from '../flow-source-table';
import FlowContext from '../../../../flow-context';
import Context from './context';
import { getFlowVariables } from '../api';
import { getSchemaFields, isFieldTypeMatch } from '../utils';
import ProcessVariableSelector from '../variable-selector';

import './styles.scss';

interface Props {
  value?: any;
  onChange?: (val: any) => void;
  name: string;
  props?: any;
  children?: React.ReactNode;
}

type Rule = 'currentFormValue' | 'fixedValue' | 'processVariable' | 'formula';

const ruleOptions: Array<{ label: string, value: Rule | any }> = [
  { label: '字段值', value: 'currentFormValue' },
  { label: '自定义', value: 'fixedValue' },
  { label: '流程变量', value: 'processVariable' },
  { label: '公式', value: 'formula' },
  { label: '节点输出', value: 'task.xx.output.xxx' },
];
const subRuleOptions: Array<{ label: string, value: Rule | any }> = [
  { label: '字段值', value: 'currentFormValue' },
  { label: '自定义', value: 'fixedValue' },
  { label: '流程变量', value: 'processVariable' },
  { label: '公式', value: 'formula' },
];

export default function CustomField(props: Props | any): JSX.Element {
  const [isFormulaShow, setIsFormulaShow] = useState<boolean>(false);
  const { tableSchema } = useContext(FlowSourceTableContext);
  const { data, setData, nodesOutputOptions } = useContext<any>(Context);
  const { flowID } = useContext(FlowContext);

  const [key, setKey] = useState<any>('');
  const [nodeID, setNodeID] = useState<any>('');

  useEffect(()=>{
    const { createRule } = data || {};
    const item: any = createRule?.[fieldName] || {};
    if (item?.valueFrom === 'task.xx.output.xxx' && item?.valueOf) {
      setKey(item?.key);
    }
  }, []);

  useEffect(()=>{
    const [parentKey, subKey] = fieldName.split('@');
    const createRules = get(data, `ref.${parentKey}.createRules[0]`, {});
    const _key = createRules?.[subKey]?.key;
    _key && setKey(_key);
  }, [data.ref]);

  useEffect(()=>{
    const { createRule } = data || {};
    const item: any = createRule?.[fieldName] || {};
    if (item?.valueFrom === 'task.xx.output.xxx' && item?.valueOf) {
      setNodeID(item?.nodeID);
    }
  }, []);

  useEffect(()=>{
    if (isArray(nodesOutputOptions)) {
      const { createRule } = data || {};
      const item: any = createRule?.[fieldName] || {};
      if (item?.valueFrom === 'task.xx.output.xxx' && item?.valueOf) {
        const opt = nodesOutputOptions?.find((itm: any)=>{
          return itm?.value === item?.valueOf;
        });
        if (!opt) {
          item.key = '';
          item.nodeID = '';
          item.valueFrom = '';
          item.valueOf = '';
          setData({ createRule });
          setKey('');
        }
      }
    }
  }, [nodesOutputOptions]);

  useEffect(()=>{
    const { createRule, ref = {} } = data || {};
    const item: any = createRule?.[fieldName] || {};
    if (item?.valueFrom === 'task.xx.output.xxx' && item?.valueOf) {
      item.key = key;
    }
    setData({ createRule });

    const [parentKey, subKey] = fieldName.split('@');
    // set(ref, `${parentKey}.createRules[0].${subKey}.key`, key);
  }, [key]);

  useEffect(()=>{
    const { createRule } = data || {};
    const item: any = createRule?.[fieldName] || {};
    if (item?.valueFrom === 'task.xx.output.xxx' && item?.valueOf) {
      item.nodeID = nodeID;
    }
    setData({ createRule });
  }, [nodeID]);

  const { data: variables, isLoading: loadingVariables } = useQuery(['FETCH_PROCESS_VARIABLES'], () => {
    return getFlowVariables(flowID);
  });
  const fieldName = props.name;
  const isSubTableKey = fieldName.indexOf('@') > 0;
  const compType = (get(props, 'props.x-component-props.x-component', '') as string).toLowerCase();
  /*
    field data type: string, number, datetime, array, object, label-value, ..
    when assign with target field, inner field type should match
   */
  const fieldDataType = get(props, 'props.x-component-props.type', 'string');

  const getVal = (prop?: string) => {
    if (!isSubTableKey) {
      return get(data, `createRule.${fieldName}.${prop || 'valueOf'}`);
    } else {
      // sub-table field
      const [parentKey, subKey] = fieldName.split('@');
      const subVal = get(data, `ref.${parentKey}.createRules[0].${subKey}`, {});
      return get(subVal, prop || 'valueOf');
    }
  };

  const onChangeValueByKey = (val: any, keyName: string): void => {
    const { createRule = {}, ref = {} } = data;
    if (!isSubTableKey) {
      set(createRule, `${fieldName}.${keyName}`, val);
      if (keyName === 'valueFrom') {
        set(createRule, `${fieldName}.valueOf`, '');
      }
      setData({ createRule });
    } else {
      const [parentKey, subKey] = fieldName.split('@');
      if (!ref[parentKey]) {
        const tableId = get(props, 'props.x-component-props.parentTableId');
        set(ref, parentKey, { tableId, createRules: [{ [subKey]: { [keyName]: val } }] });
      } else {
        set(ref, `${parentKey}.createRules[0].${subKey}.${keyName}`, val);
        if (keyName === 'valueFrom') {
          set(ref, `${parentKey}.createRules[0].${subKey}.valueOf`, '');
        }
      }
      setData({ ref });
    }
  };

  const onChangeFieldValue = (val: any): void => {
    onChangeValueByKey(val, 'valueOf');
  };

  const onChangeRule = (rule: Rule): void => {
    onChangeValueByKey(rule, 'valueFrom');
    setKey('');
  };

  const getVailVal = (prop?: any)=>{
    if (!isSubTableKey) {
      return get(data, `createRule.${fieldName}.${prop || 'valueOf'}`);
    } else {
      // sub-table field
      const [parentKey, subKey] = fieldName.split('@');
      const subVal = get(data, `ref.${parentKey}.createRules[0].${subKey}`, {});
      return get(subVal, prop || 'valueOf');
    }
  };
  const renderValueBox = (): JSX.Element | ReactNode | null | undefined => {
    const rule = getVal('valueFrom');
    if (rule === 'currentFormValue') {
      return (
        <Select
          options={getSchemaFields(tableSchema, {
            matchTypeFn: (schema: ISchema) => isFieldTypeMatch(fieldDataType, compType, schema),
            excludeComps: ['serial', 'aggregationrecords'],
          })}
          value={getVal() as string}
          onChange={onChangeFieldValue}
        />
      );
    }

    if (rule === 'fixedValue') {
      return props.children;
    }

    if (rule === 'processVariable') {
      if (loadingVariables) {
        return (
          <div>Loading variables...</div>
        );
      }

      return (
        <ProcessVariableSelector
          value={getVal()}
          onChange={onChangeFieldValue}
        />
      );
    }

    if (rule === 'formula') {
      const value = typeof getVal() === 'string' ? getVal() : '';
      return (
        <div className="flex justify-between" style={{ height: '32px' }}>
          <Button onClick={handleConfigFormula}>配置公式</Button>
          {value && (
            <span className="ml-3" style={{ wordBreak: 'break-all' }}>{value}</span>
          )}
        </div>
      );
    }
    if (rule === 'task.xx.output.xxx') {
      return (
        <div className='flex '>
          <AntSelect
            style={{ width: 'auto', minWidth: '200px', height: '32px' }}
            options={nodesOutputOptions?.filter((item: any)=>!!item?.value)}
            value={getVailVal()}
            onChange={(val)=>{
              onChangeFieldValue(val);
              // setKey(val?.replace('$(local.', '')?.replace(')', ''));
              const valArr = val?.replace(')', '')?.split('.');
              const key = valArr?.[valArr?.length - 1];
              setKey(key);
              const opt = nodesOutputOptions?.find((item: any)=>{
                return item?.value === val;
              });
              if (opt) {
                setNodeID(opt?.nodeID);
              }
            }}
            onClear={()=>{
              setKey('');
            }}
            allowClear
          />
          <div className='flex '>
            <span className='noWrap ml-10'>key：</span>
            <Input
              style={{ width: '150px', height: '32px' }}
              value={key}
              onChange={(e)=>{
                const value = e.target.value;
                const filteredString = value?.replace(/[^0-9a-zA-Z_]/g, '');
                setKey(filteredString);
              }}></Input> </div>
        </div>
      );
    }
  };

  function handleConfigFormula(): void {
    setIsFormulaShow(true);
  }

  function handleFormulaClose(): void {
    setIsFormulaShow(false);
  }

  function handleSubmit(value: string): void {
    onChangeFieldValue(value);
    handleFormulaClose();
  }

  return (
    <div className="flex mb-20" key={nodesOutputOptions?.length}>
      {props.props['x-component-props'].required && (<span className="text-red-600 mr-6">*</span>)}
      <span className="w-100" style={{ minWidth: '100px', wordBreak: 'break-all' }}>
        {props.props['x-component-props'].title}
      </span>
      <span className="mx-10">=</span>
      <AntSelect
        style={{ width: '120px', height: '32px' }}
        options={isSubTableKey ? subRuleOptions : ruleOptions}
        value={getVal('valueFrom')}
        onChange={onChangeRule}
        allowClear/>
      <div className={cs('inline-flex ml-10 custom-field__value', {
        'xl-width': getVal('valueFrom') === 'fixedValue' &&
          ['associatedrecords', 'associateddata'].includes(compType),
      })}>
        {renderValueBox()}
      </div>
      {isFormulaShow && (
        <FormulaModal
          onClose={handleFormulaClose}
          value={typeof getVal() === 'string' ? getVal() : ''}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

CustomField.isVirtualFieldComponent = true;
