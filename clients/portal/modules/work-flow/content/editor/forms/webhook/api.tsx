import React, { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import Loading from '@c/loading';
import APISelector from '@polyApi/nodes/forms/request-config/api-selector';
import { useGetRequestNodeApi } from '@polyApi/effects/api/raw';
import { mergeInputs } from '@polyApi/nodes/forms/request-config';
import { filterPolyApiInputs } from '@polyApi/utils/request-node';

interface Value {
  value: string;
}

interface Props {
  value: Value;
  onChange: (value: Value) => void;
  setFormValue: UseFormSetValue<any>;
  values: Record<string, any>;
  error?: string;
}

export default function API(
  { value, onChange, setFormValue, values, error: errorMessage }: Props,
): JSX.Element {
  const { data: apiDocDetail, isLoading, error } = useGetRequestNodeApi({
    path: value.value.slice(1),
    body: { docType: 'raw', titleFirst: true },
  }, { enabled: !!value.value });

  useEffect(() => {
    apiDocDetail?.doc.url && setFormValue('url', apiDocDetail.doc.url);
    apiDocDetail?.doc.input.inputs && setFormValue(
      'inputs', mergeInputs(values.inputs, filterPolyApiInputs(apiDocDetail.doc.input.inputs)),
    );
    apiDocDetail?.doc.method && setFormValue('method', apiDocDetail.doc.method);
  }, [apiDocDetail?.doc]);

  useEffect(() => {
    const output = apiDocDetail?.doc.output.doc?.[0]?.data;
    output && setFormValue('outputs', output);
  }, [apiDocDetail?.doc.output.doc?.[0]?.data]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (error) {
    return <span className="text-red-500">{error}</span>;
  }

  return (
    <>
      <APISelector
        initRawApiPath={value.value}
        setApiPath={(path) => onChange({ value: path })}
        className="webhook-api-select"
        label="API:"
        error={errorMessage}
      />
      <label className="block">
        请求方法:
      </label>
      <input
        type="text"
        className="w-full px-12 py-5 text-gray-900"
        value={apiDocDetail?.doc.method || ''}
        disabled
      />
      <label className="block">
        Webhook URL:
      </label>
      <textarea
        className="w-full px-12 py-5 border rounded-tl-2 rounded-tr-8 rounded-bl-8 rounded-br-8
          resize-none text-gray-900"
        value={apiDocDetail?.doc.url || ''}
        disabled
      />
    </>
  );
}
