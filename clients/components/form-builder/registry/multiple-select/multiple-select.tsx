import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { getDatasetById } from '@portal/modules/system-mgmt/dataset/api';
import { parseJSON } from '@lib/utils';

const { Option } = Select;

function MultipleSelect(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const [options, setOptions] = useState<LabelValue[]>([]);
  const datasetId = fieldProps.props['x-component-props'].datasetId;
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

  function handleSelectChange(value: string[]): void {
    fieldProps.mutators.change(value);
  }

  return (
    <Select
      mode="multiple"
      value={fieldProps.value}
      onChange={handleSelectChange}
    >
      {
        options.map((option): JSX.Element => {
          return (
            <Option key={option.value} value={option.value}>{option.label}</Option>);
        })
      }
    </Select>
  );
}

MultipleSelect.isFieldComponent = true;

export default MultipleSelect;
