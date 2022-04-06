import { isEmpty } from 'lodash';

import stores from './stores';

import {
  setBatchGlobalConfig,
  getBatchGlobalConfig,
  setArteryEngineMenuType,
} from '@lib/api/user-config';
import toast from '@lib/toast';

import store from '../app-details/store';
import SimpleViewRenders from '@c/simple-view-render';

export const PG_SAVED_PREFIX = 'pge-';
export const PG_DRAFT_PREFIX = 'pge-draft-';
export const PG_VERSION = '0.1.0';

type Option={
  draft?: boolean;
  [key: string]: any
}

export function getArteryKey(appID: string, pageID: string, isDraft: boolean): string[] {
  const key = `custom_page_schema:app_id:${appID}:page_id:${pageID}`;
  const newKey = `app_id:${appID}:page_id:${pageID}:custom_page_schema`;
  if (isDraft) {
    return [`${key}:draft`, `${newKey.replace(':custom_page_schema', '')}:draft:custom_page_schema`];
  }

  return [key, newKey];
}

export function savePage(app_id: string, page_id: string, page_artery: any, options?: Option): Promise<any> {
  const arteryKeys = getArteryKey(app_id, page_id, !!options?.draft);
  return setBatchGlobalConfig(arteryKeys.map((key) => ({
    key,
    version: PG_VERSION,
    value: typeof page_artery === 'object' ? JSON.stringify(page_artery) : page_artery,
  })));
}

export function getPage(app_id: string, page_id: string, options?: Option): Promise<string | void> {
  const [queryId, newQueryId] = getArteryKey(app_id, page_id, !!options?.draft);
  const result = getBatchGlobalConfig([{
    key: queryId,
    version: PG_VERSION,
  }]);
  const newResult = getBatchGlobalConfig([{
    key: newQueryId,
    version: PG_VERSION,
  }]);
  return Promise.all([result, newResult]).then(([{ result }, { result: newResult }]) => {
    if (newResult && !isEmpty(newResult)) {
      return newResult[newQueryId];
    }
    return result[queryId];
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

export function updateArteryEngineMenuType(appID: string, id: string): void {
  setArteryEngineMenuType(appID, id).then(() => {
    store.setActiveMenu({ ...store.curPage, menuType: 3 });
  }).catch((err: any) => toast.error(err));
}
