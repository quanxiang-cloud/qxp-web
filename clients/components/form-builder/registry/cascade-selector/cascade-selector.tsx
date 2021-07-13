import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Cascader, CascaderProps } from 'antd';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { omit, last } from 'lodash';

import { getDatasetById } from '@portal/modules/system-mgmt/dataset/api';

export type DefaultValueFrom = 'customized' | 'predefined-dataset';

interface FetchOptions extends CascaderProps {
  predefinedDataset?: string;
  defaultValueFrom: DefaultValueFrom;
  options: CascaderOptionType[];
}

export type CascadeSelectorProps = CascaderProps & {
  predefinedDataset?: string;
  defaultValueFrom: DefaultValueFrom;
  showFullPath?: boolean;
  onChange: (value: CascaderOptionType) => void;
  value: CascaderOptionType;
}

function useFetchOptions({
  options,
  defaultValueFrom,
  predefinedDataset,
}: FetchOptions): CascaderOptionType[] {
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

function CascadeSelector({
  predefinedDataset,
  defaultValueFrom,
  showFullPath,
  value,
  ...cascadeProps
}: CascadeSelectorProps): JSX.Element {
  const options = useFetchOptions({
    predefinedDataset,
    defaultValueFrom,
    options: cascadeProps.options || [],
  });

  function handleChange(_value: CascaderValueType, selected?: CascaderOptionType[]): void {
    const labelToSave = (selected || []).map(({ label }) => label).join('/');
    const valueToSave = _value.join('/');
    cascadeProps && cascadeProps.onChange({ label: labelToSave, value: valueToSave });
  }

  return (
    <Cascader
      {...omit(cascadeProps, ['options', 'onChange'])}
      displayRender={(labels) => {
        return showFullPath ? labels.join(' / ') : last(labels);
      }}
      value={(value?.value as string || '').split('/')}
      onChange={handleChange}
      options={options}
    />
  );
}

export default CascadeSelector;
