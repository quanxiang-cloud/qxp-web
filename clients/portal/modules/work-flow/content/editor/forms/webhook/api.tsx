import React from 'react';

import APISelector from '@polyApi/nodes/forms/request-config/api-selector';
import { useGetRequestNodeApi } from '@polyApi/effects/api/raw';
import Loading from '@c/loading';

interface Value {
  value: string;
}

interface Props {
  value: Value;
  onChange: (value: Value) => void;
}

export default function API({ value, onChange }: Props) : JSX.Element {
  const { data: apiDocDetail, isLoading, error } = useGetRequestNodeApi({
    path: value.value.slice(1),
    body: { docType: 'raw', titleFirst: true },
  }, { enabled: !!value.value });

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  if (error) {
    return <span className="text-red-500">{error}</span>;
  }

  return (
    <APISelector
      initRawApiPath={value.value}
      setApiPath={(path) => onChange({ value: path })}
      apiDocDetail={apiDocDetail}
    />
  );
}
