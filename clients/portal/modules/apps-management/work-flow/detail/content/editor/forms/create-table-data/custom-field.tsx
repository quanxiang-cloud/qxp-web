import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { get, set } from 'lodash';

import Select from '@c/select';
import FlowSourceTableContext from '../flow-source-table';
import FlowContext from '../../../../flow-context';
import Context from './context';
import { getFlowVariables } from '../api';
import { getSchemaFields } from '../utils';

import './styles.scss';

interface Props {
  value?: any;
  onChange?: (val: any) => void;
  name: string;
  props?: any;
  children?: React.ReactNode;
}

type Rule = 'currentFormValue' | 'fixedValue' | 'processVariable';

const ruleOptions: Array<{ label: string, value: Rule }> = [
  { label: '字段值', value: 'currentFormValue' },
  { label: '自定义', value: 'fixedValue' },
  { label: '流程变量', value: 'processVariable' },
];

export default function CustomField(props: Props): JSX.Element {
  const { tableSchema } = useContext(FlowSourceTableContext);
  const { data, setData } = useContext(Context);
  const { flowID } = useContext(FlowContext);
  const { data: variables, isLoading: loadingVariables } = useQuery(['FETCH_PROCESS_VARIABLES'], () => {
    return getFlowVariables(flowID);
  });
  const fieldName = props.name;
  const isSubTableKey = fieldName.indexOf('@') > 0;

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

  const onChangeValueByKey = (val: any, keyName: string) => {
    const { createRule = {}, ref = {} } = data;
    if (!isSubTableKey) {
      set(createRule, `${fieldName}.${keyName}`, val);
      setData({ createRule });
    } else {
      const [parentKey, subKey] = fieldName.split('@');
      if (!ref[parentKey]) {
        const tableId = get(props, 'props.x-component-props.parentTableId');
        set(ref, parentKey, { tableId, createRules: [{ [subKey]: { [keyName]: val } }] });
      } else {
        set(ref, `${parentKey}.createRules[0].${subKey}.${keyName}`, val);
      }
      setData({ ref });
    }
  };

  const onChangeFieldValue = (val: any) => {
    onChangeValueByKey(val, 'valueOf');
  };

  const onChangeRule = (rule: Rule) => {
    onChangeValueByKey(rule, 'valueFrom');
  };

  const renderValueBox = () => {
    const rule = getVal('valueFrom');
    if (rule === 'currentFormValue') {
      return (
        <Select
          options={getSchemaFields(tableSchema)}
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
        <Select
          options={variables?.map(({ code, name }) => ({ label: name, value: code })) || []}
          value={getVal() as string}
          onChange={onChangeFieldValue}
        />
      );
    }
  };

  return (
    <div className="flex items-center mb-20">
      <span className="w-64">{props.props['x-component-props'].title}</span>
      <span className="mx-10">=</span>
      <Select options={ruleOptions} value={getVal('valueFrom')} onChange={onChangeRule} />
      <div className="inline-flex items-center ml-10 custom-field__value">
        {renderValueBox()}
      </div>
    </div>
  );
}

CustomField.isVirtualFieldComponent = true;
