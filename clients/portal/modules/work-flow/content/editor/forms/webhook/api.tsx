import React, { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';

import APISelector from '@polyApi/nodes/forms/request-config/api-selector';
import { useGetRequestNodeApi } from '@polyApi/effects/api/raw';
import { mergeInputs } from '@polyApi/nodes/forms/request-config';
import Loading from '@c/loading';

interface Value {
  value: string;
}

interface Props {
  value: Value;
  onChange: (value: Value) => void;
  setFormValue: UseFormSetValue<any>;
  values: Record<string, any>;
}

export default function API({ value, onChange, setFormValue, values }: Props): JSX.Element {
  const { data: apiDocDetail, isLoading, error } = useGetRequestNodeApi({
    path: value.value.slice(1),
    body: { docType: 'raw', titleFirst: true },
  }, { enabled: !!value.value });

  useEffect(() => {
    apiDocDetail?.doc.url && setFormValue('url', apiDocDetail.doc.url);
    apiDocDetail?.doc.input.inputs && setFormValue(
      'inputs', mergeInputs(values.inputs, apiDocDetail.doc.input.inputs),
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
        apiDocDetail={apiDocDetail}
        className="webhook-api-select"
        label="API:"
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
