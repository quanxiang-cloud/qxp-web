import { UseQueryOptions } from 'react-query';
import { Artery } from '@one-for-all/artery';

import { parseJSON } from '@lib/utils';

import { useAbstractQuery, UseAbstractQueryReturn } from './common';
import { getPage } from '../api';
import { QUERY_KEY } from '../constants';
import { useEffect, useMemo, useState } from 'react';
import toast from '@lib/toast';

interface QueryArteryInput {
  arteryID: string;
}
type QueryArteryResponse = Artery;
export function useQueryArtery(
  input: QueryArteryInput,
  options: UseQueryOptions<QueryArteryResponse | undefined, Error>,
): UseAbstractQueryReturn<QueryArteryResponse> {
  const { arteryID } = input;
  return useAbstractQuery<QueryArteryInput, QueryArteryResponse | undefined>({}, {
    ...options,
    getQueryKey: () => [QUERY_KEY.ARTERY, arteryID],
    queryFunction: async () => {
      const artery = await getPage(arteryID);
      if (!artery) {
        return;
      }
      return parseJSON<Artery | undefined>(artery, undefined);
    },
  });
}

type GetArteryResponse = {
  loading: boolean;
  artery?: Artery;
}

export function useGetArtery(arteryID: string): GetArteryResponse {
  const [loading, setLoading] = useState(false);
  const [artery, setArtery] = useState<Artery | undefined>();

  useEffect(() => {
    if (!arteryID) return;
    setLoading(true);
    getPage(arteryID)
      .then((artery) => !!artery && setArtery(parseJSON<Artery | undefined>(artery, undefined)))
      .catch(toast.error)
      .finally(() => setLoading(false));
  }, []);

  return useMemo(() => {
    return { artery, loading };
  }, [artery, loading]);
}

