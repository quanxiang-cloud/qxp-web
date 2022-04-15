import {
  getBatchGlobalConfig,
  setBatchGlobalConfig,
} from '@lib/api/user-config';
import toast from '@lib/toast';
import SimpleViewRenders from '@c/simple-view-render';

import stores from './stores';
import { getArteryKeys } from './utils';
import { ARTERY_VERSION } from '@portal/constants';

export const PG_SAVED_PREFIX = 'pge-';
export const PG_DRAFT_PREFIX = 'pge-draft-';

type Option={
  draft?: boolean;
  [key: string]: any
}

export function savePage(arteryID: string, page_artery: any, options?: Option): Promise<any> {
  const arteryKeys = getArteryKeys(arteryID, !!options?.draft);
  return setBatchGlobalConfig(arteryKeys.map((key) => ({
    key,
    version: ARTERY_VERSION,
    value: typeof page_artery === 'object' ? JSON.stringify(page_artery) : page_artery,
  })));
}

export function getPage(arteryID: string, options?: Option): Promise<string | void> {
  const arteryKeys = getArteryKeys(arteryID, !!options?.draft);
  return getBatchGlobalConfig(arteryKeys.map((key) => ({ key, version: ARTERY_VERSION }))).then(({ result }) => {
    return result[arteryKeys[0]];
  }).catch(toast.error);
}

export function getRenderRepository(): any {
  const comps = stores.registry.toComponentMap('ofa-ui');
  const systemComps = stores.registry.toComponentMap('systemComponents');

  return {
    'ofa-ui@latest': comps,
    '@one-for-all/ui@latest': comps,
    'SimpleViewRenders@1.0.0': SimpleViewRenders,
    'system-components@latest': systemComps,
  };
}

