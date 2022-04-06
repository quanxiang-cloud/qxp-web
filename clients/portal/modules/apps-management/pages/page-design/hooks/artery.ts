import { UseQueryOptions } from 'react-query';
import { Artery } from '@one-for-all/artery';

import { parseJSON } from '@lib/utils';

import { useAbstractQuery, UseAbstractQueryReturn } from './common';
import { getPage } from '../api';
import { QUERY_KEY } from '../constants';

interface QueryArteryInput {
  appID: string;
  pageId: string;
}
type QueryArteryResponse = Artery;
export function useQueryArtery(
  input: QueryArteryInput,
  options: UseQueryOptions<QueryArteryResponse | undefined, Error>,
): UseAbstractQueryReturn<QueryArteryResponse> {
  const { appID, pageId } = input;
  return useAbstractQuery<QueryArteryInput, QueryArteryResponse | undefined>({}, {
    ...options,
    getQueryKey: () => [QUERY_KEY.ARTERY, appID, pageId],
    queryFunction: async () => {
      const artery = await getPage(appID, pageId);
      if (!artery) {
        return;
      }
      return parseJSON<Artery | undefined>(artery, undefined);
    },
  });
}

