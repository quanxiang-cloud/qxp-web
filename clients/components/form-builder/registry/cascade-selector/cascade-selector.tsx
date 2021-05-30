import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Cascader } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { omit } from 'lodash';

import { datasetRecord } from './mock-dataset';

// import httpClient from '@lib/http-client';

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

    // return httpClient<CascaderOptionType[]>('/api/dataset/some_id');
    return new Promise<CascaderOptionType[]>((resolve) => {
      setTimeout(() => resolve(datasetRecord[predefinedDataset] || []), 1 * 1000);
    });
  });

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
  const { predefinedDataset, defaultValueFrom } = props.props['x-internal'];
  const options = useFetchOptions({ predefinedDataset, defaultValueFrom, options: cascadeProps.options });

  function handleChange(_value: CascaderValueType, selected?: CascaderOptionType[]) {
    const valueToSave = (selected || []).map(({ value }) => value).join('/');
    const labelToSave = (selected || []).map(({ label }) => label).join(' / ');
    props.mutators.change({ label: labelToSave, value: valueToSave });
  }

  return (
    <Cascader
      {...omit(cascadeProps, 'options')}
      value={(props.value?.value || '').split('/')}
      options={options}
      onChange={handleChange}
    />
  );
}

CascadeSelector.isFieldComponent = true;

export default CascadeSelector;
