import { useState, useEffect, useReducer } from 'react';

import { CancellableRequest } from '../cancellable-request';

export default function useRequest<T>(input: RequestInfo, fetchOptions?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [tryNo, incTryNo] = useReducer((x) => x + 1, 0);
  const [request, setRequest] = useState(() => new CancellableRequest<T>(input, fetchOptions));
  useEffect(() => {
    request.fetch()
      .then(setData)
      .catch((e) => {
        if (!e.message.match(/The user aborted a request/)) {
          throw e;
        }
      });
    return () => {
      setData(null);
      request.cancel();
    };
  }, [request]);

  function retry() {
    incTryNo();
    setRequest(new CancellableRequest<T>(input, fetchOptions));
  }

  function cancel() {
    request.cancel();
  }

  return [data, { setRequest, retry, cancel, retryNo: tryNo }];
}
