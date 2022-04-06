
import stores from './stores';

import {
  getBatchGlobalConfig,
  setBatchGlobalConfig,
  setPageEngineMenuType,
} from '@lib/api/user-config';
import toast from '@lib/toast';
import SimpleViewRenders from '@c/simple-view-render';

import { getArteryKeys } from './utils';
import store from '../app-details/store';

export const PG_SAVED_PREFIX = 'pge-';
export const PG_DRAFT_PREFIX = 'pge-draft-';
export const PG_VERSION = '1.0.0';

type Option={
  draft?: boolean;
  [key: string]: any
}

export function savePage(arteryID: string, page_schema: any, options?: Option): Promise<any> {
  const arteryKeys = getArteryKeys(arteryID, !!options?.draft);
  return setBatchGlobalConfig(arteryKeys.map((key) => ({
    key,
    version: PG_VERSION,
    value: typeof page_schema === 'object' ? JSON.stringify(page_schema) : page_schema,
  })));
}

export function getPage(arteryID: string, options?: Option): Promise<string | void> {
  const arteryKeys = getArteryKeys(arteryID, !!options?.draft);
  return getBatchGlobalConfig(arteryKeys.map((key) => ({ key, version: PG_VERSION }))).then(({ result }) => {
    return result[arteryKeys[0]];
  }).catch(toast.error);
}

export function getVersionKey(): string {
  return PG_VERSION;
}

export function getRenderRepository(): any {
  const comps = stores.registry.toComponentMap();
  return {
    'ofa-ui@latest': comps,
    'SimpleViewRenders@1.0.0': SimpleViewRenders,
    '@one-for-all/ui@latest': comps,
  };
}

export function updatePageEngineMenuType(appID: string, id: string): void {
  setPageEngineMenuType(appID, id).then((res) => {
    store.setActiveMenu({ ...store.curPage, menuType: 3 });
  }).catch((err) => toast.error(err));
}
