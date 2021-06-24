import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { get } from 'lodash';

import Select from '@c/select';
import FlowSourceTableContext from '../flow-source-table';
import Context from './context';
import { getFlowVariables } from '../api';

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
  const fieldName = props.name;
  const { data: variables, isLoading: loadingVariables } = useQuery(['FETCH_PROCESS_VARIABLES'], getFlowVariables);
  const getVal = (prop?: string) => get(data, `createRule.${fieldName}.${prop || 'valueOf'}`);

  const onChangeFieldValue = (val: any) => {
    setData({
      createRule: {
        ...(data.createRule || {}),
        [fieldName]: {
          valueFrom: getVal('valueFrom'),
          valueOf: val,
        },
      },
    });
  };

  const onChangeRule = (rule: Rule) => {
    const { createRule = {} } = data;
    const curRule = createRule[fieldName] || {};
    setData({
      createRule: {
        ...createRule,
        [fieldName]: {
          ...curRule,
          valueFrom: rule,
        },
      },
    });
  };

  const renderValueBox = () => {
    const rule = getVal('valueFrom');
    if (rule === 'currentFormValue') {
      const tableFields = Object.entries(tableSchema.properties || {}).map(([key, fieldSchema]) => {
        return { label: fieldSchema.title as string, value: key };
      });

      return (
        <Select
          options={tableFields}
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
