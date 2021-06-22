import React from 'react';
import { useSchemaProps, SchemaMarkupField as Field } from '@formily/antd';

import Select from '@c/select';

import './styles.scss';

const ruleOptions = [
  { label: '字段值', value: 'currentFormValue' },
  { label: '自定义', value: 'fixedValue' },
  { label: '流程变量', value: 'processVariable' },
];

interface Props {
  value?: any;
  onChange?: (val: any) => void;
  props?: any;
  name?: string;
  children?: React.ReactNode;
}

export default function CustomField(props: Props) {
  // const schemaProps = useSchemaProps();

  const renderValueBox = () => {
    // render field orig component
    return props.children;
  }

  console.log('custom field: ', props);

  return (
    <div className="flex items-center mb-20">
      <span className="w-80">{props.props['x-component-props'].title}</span>
      <span className="mx-10">=</span>
      <Select options={ruleOptions} />
      <div className="inline-flex items-center ml-10 custom-field__value">
        {renderValueBox()}
      </div>
    </div>
  );
}

// CustomField.isFieldComponent = true;
CustomField.isVirtualFieldComponent = true;
