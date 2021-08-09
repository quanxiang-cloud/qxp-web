import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { getDatasetNames } from '@portal/modules/system-mgmt/dataset/api';

const { Option } = Select;

function DatasetConfig(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const [selectOptions, setSelectOptions] = useState<LabelValue[]>([]);

  useEffect(() => {
    getDatasetNames({ type: 1 }).then(({ list }) => {
      const newOptions = list.map(({ id, name }) => ({
        label: name,
        value: id,
      }));
      setSelectOptions(newOptions);
    });
  }, []);

  function handleSelectChange(value: string): void {
    fieldProps.mutators.change(value);
  }

  return (
    <Select onChange={handleSelectChange} value={fieldProps.value}>
      {
        selectOptions.map((option) => {
          return (<Option key={option.value} value={option.value}>{option.label}</Option>);
        })
      }
    </Select>
  );
}

DatasetConfig.isFieldComponent = true;

export default DatasetConfig;
