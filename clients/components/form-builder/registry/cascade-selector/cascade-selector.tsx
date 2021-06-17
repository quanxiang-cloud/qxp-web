import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Cascader } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { omit, last } from 'lodash';

import { getDatasetById } from '@portal/modules/system-mgmt/dataset/api';

interface Props {
  predefinedDataset?: string;
  defaultValueFrom: 'customized' | 'predefined-dataset';
  options: CascaderOptionType[];
}

function useFetchOptions({ options, defaultValueFrom, predefinedDataset }: Props) {
  const [preparedOptions, setOptions] = useState(options || []);
  useEffect(() => setOptions(options), [options, defaultValueFrom]);

  const { data, isLoading, isError } = useQuery([defaultValueFrom, predefinedDataset], () => {
    if (defaultValueFrom === 'customized' || !predefinedDataset) {
      return options;
    }

    return getDatasetById(predefinedDataset).then(({ content }: Dataset) => {
      let parsedCont;
      try {
        parsedCont = JSON.parse(content || '[]');
      } catch (err) {
        parsedCont = [];
      }
      return parsedCont;
    });
  }, { cacheTime: -1 });

  useEffect(() => {
    if (isLoading || isError || !data) {
      return;
    }

    setOptions(data);
  }, [data, isLoading, isError]);

  return preparedOptions;
}

function CascadeSelector(props: ISchemaFieldComponentProps): JSX.Element {
  const cascadeProps = props.props['x-component-props'];
  const { predefinedDataset, defaultValueFrom, showFullPath } = props.props['x-internal'];
  const options = useFetchOptions({ predefinedDataset, defaultValueFrom, options: cascadeProps.options });

  useEffect(() => {
    // clear cascade when change value source
    // when initialValue not undefined, is edit mode
    if (!props.initialValue) {
      handleChange([], []);
    }
  }, [defaultValueFrom]);

  function handleChange(_value: CascaderValueType, selected?: CascaderOptionType[]) {
    const labelToSave = (selected || []).map(({ label }) => label).join('/');
    const valueToSave = _value.join('/');
    props.mutators.change({ label: labelToSave, value: valueToSave });
  }

  return (
    <Cascader
      {...omit(cascadeProps, 'options')}
      value={(props.value?.value || '').split('/')}
      displayRender={() => {
        const labelParts = (props.value?.label || '').split('/');
        return showFullPath ? labelParts.join(' / ') : last(labelParts);
      }}
      options={options}
      onChange={handleChange}
    />
  );
}

CascadeSelector.isFieldComponent = true;

export default CascadeSelector;
