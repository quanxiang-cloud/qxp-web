import {
  getBatchGlobalConfig,
  setBatchGlobalConfig,
} from '@lib/api/user-config';
import toast from '@lib/toast';
import { ARTERY_KEY_VERSION } from '@portal/constants';

type Option={
  draft?: boolean;
  [key: string]: any
}

export function savePage(arteryID: string, page_artery: any): Promise<any> {
  return setBatchGlobalConfig([{
    key: arteryID,
    version: ARTERY_KEY_VERSION,
    value: typeof page_artery === 'object' ? JSON.stringify(page_artery) : page_artery,
  }]);
}

export function getPage(arteryID: string, options?: Option): Promise<string | void> {
  return getBatchGlobalConfig([{ key: arteryID, version: ARTERY_KEY_VERSION }]).then(({ result }) => {
    return result[arteryID];
  }).catch(toast.error);
}
