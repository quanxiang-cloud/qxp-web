import React, { ChangeEvent, useState, useEffect } from 'react';
import { Radio, Input, RadioChangeEvent, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { getDatasetById } from '@portal/modules/system-mgmt/dataset/api';

function RadioGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const [options, setOptions] = useState<LabelValue[]>([]);
  const [customValue, setCustomValue] = useState('');

  const isAllowCustom = !!fieldProps.props['x-component-props'].allowCustom;
  const optionsLayout = fieldProps.props['x-component-props'].optionsLayout;
  const datasetId = fieldProps.props['x-component-props'].datasetId;
  const defaultValueFrom = fieldProps.props['x-internal'].defaultValueFrom;

  useEffect(() => {
    if (fieldProps.props.enum && defaultValueFrom === 'customized') {
      setOptions(fieldProps.props.enum || []);
    }
  }, [fieldProps.props.enum]);

  useEffect(() => {
    if (fieldProps.value) {
      const isHave = options.some((option): boolean => option.value === fieldProps.value);
      if (!isHave) {
        setCustomValue(fieldProps.value);
        return;
      }
      setCustomValue('');
    }
  }, [fieldProps.value, options]);

  useEffect(() => {
    if (datasetId && defaultValueFrom === 'dataset') {
      getDatasetById(datasetId).then(({ content }) => {
        let _options = [];
        _options = JSON.parse(content || '[]');
        setOptions(_options);
      });
    }
  }, [datasetId]);

  function handleCustomValueChange(e: ChangeEvent<HTMLInputElement>): void {
    setCustomValue(e.target.value);
    fieldProps.mutators.change(e.target.value);
  }

  function handleRadioChange(e: RadioChangeEvent): void {
    fieldProps.mutators.change(e.target.value);
  }

  if (options.length === 0) {
    return <span>当前选项集无数据。</span>;
  }

  return (
    <div className="flex items-center">
      <Radio.Group onChange={handleRadioChange} value={fieldProps.value}>
        <Space direction={optionsLayout}>
          {
            options.map((option): JSX.Element => {
              return (<Radio key={option.value} value={option.value}>{option.label}</Radio>);
            })
          }
          {
            isAllowCustom && (
              <Radio value={customValue}>
                <Input value={customValue} onChange={handleCustomValueChange} placeholder="请输入" />
              </Radio>
            )
          }
        </Space>
      </Radio.Group>
    </div>
  );
}

RadioGroup.isFieldComponent = true;

export default RadioGroup;
