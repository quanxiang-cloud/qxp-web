import { useQuery } from 'react-query';
import { Artery } from '@one-for-all/artery';

import toast from '@lib/toast';
import { parseJSON } from '@lib/utils';
import { getBatchGlobalConfig } from '@lib/api/user-config';
import { ARTERY_KEY_VERSION } from '@portal/constants';

export function queryArtery(arteryID: string): { artery?: Artery; isLoading: boolean } {
  const { data: artery, isLoading } = useQuery(['artery', arteryID], () => {
    return getBatchGlobalConfig([{ key: arteryID, version: ARTERY_KEY_VERSION }])
      .then(({ result }) => parseJSON<Artery | undefined>(result[arteryID], undefined))
      .catch(() => {
        toast.error('查询页面 schema 失败');
        return undefined;
      });
  });

  return { artery, isLoading };
}
