import {
  getBatchGlobalConfig,
  setBatchGlobalConfig,
} from '@lib/api/user-config';
import toast from '@lib/toast';
import SimpleViewRenders from '@c/simple-view-render';

import stores from './stores';
import { getArteryKeys } from './utils';
import { ARTERY_KEY_VERSION } from '@portal/constants';

type Option={
  draft?: boolean;
  [key: string]: any
}

export function savePage(arteryID: string, page_artery: any, options?: Option): Promise<any> {
  const arteryKeys = getArteryKeys(arteryID, !!options?.draft);
  return setBatchGlobalConfig(arteryKeys.map((key) => ({
    key,
    version: ARTERY_KEY_VERSION,
    value: typeof page_artery === 'object' ? JSON.stringify(page_artery) : page_artery,
  })));
}

export function getPage(arteryID: string, options?: Option): Promise<string | void> {
  const arteryKeys = getArteryKeys(arteryID, !!options?.draft);
  return getBatchGlobalConfig(arteryKeys.map((key) => {
    return { key, version: ARTERY_KEY_VERSION };
  })).then(({ result }) => {
    return result[arteryKeys[0]];
  }).catch(toast.error);
}

export function getRenderRepository(): any {
  const comps = stores.registry.toComponentMap('ofa-ui');
  const systemComps = stores.registry.toComponentMap('systemComponents');
  console.log(Object.keys(comps));
  console.log(Object.keys(systemComps));
  return {
    'ofa-ui@latest': comps,
    '@one-for-all/ui@latest': comps,
    'SimpleViewRenders@1.0.0': SimpleViewRenders,
    'system-components@latest': systemComps,
  };
}
