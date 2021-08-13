import React, { useState, useEffect } from 'react';
import { Checkbox, Space } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { getDatasetById } from '@portal/modules/system-mgmt/dataset/api';
import { parseJSON } from '@lib/utils';

type CheckboxValueType = string | number | boolean;

function CheckBoxGroup(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const [options, setOptions] = useState<LabelValue[]>([]);
  const { optionsLayout, datasetId } = fieldProps.props['x-component-props'];
  const defaultValueFrom = fieldProps.props['x-internal'].defaultValueFrom;

  useEffect(() => {
    if (fieldProps.props.enum && defaultValueFrom === 'customized') {
      setOptions(fieldProps.props.enum || []);
    }
  }, [fieldProps.props.enum]);

  useEffect(() => {
    if (datasetId && defaultValueFrom === 'dataset') {
      getDatasetById(datasetId).then(({ content = '' }) => {
        let _options = [];
        _options = parseJSON(content, []);
        setOptions(_options);
      });
    }
  }, [datasetId]);

  function handleCheckBoxChange(value: Array<CheckboxValueType>): void {
    fieldProps.mutators.change(value);
  }

  if (options.length === 0) {
    return <span>当前选项集无数据。</span>;
  }

  return (
    <div className="flex items-center">
      <Checkbox.Group onChange={handleCheckBoxChange} value={fieldProps.value}>
        <Space direction={optionsLayout}>
          {
            options.map((option): JSX.Element => {
              return (
                <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>);
            })
          }
        </Space>
      </Checkbox.Group>
    </div>
  );
}

CheckBoxGroup.isFieldComponent = true;

export default CheckBoxGroup;
