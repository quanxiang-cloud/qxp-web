import React from 'react';

import useObservable from '@lib/hooks/use-observable';

import ApiDocDetail from './api-doc-detail';
import store$ from '../store';

export default function PolyDocDetail(): JSX.Element {
  const store = useObservable(store$);
  const { namespace, name } = store.polyInfo || {};
  const url = namespace && name ? `${namespace}/${name}` : '';

  return (
    <ApiDocDetail
      method={store.polyInfo?.method}
      url={url}
      identifier={store.polyInfo?.name}
    />
  );
}
