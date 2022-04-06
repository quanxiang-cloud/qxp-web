
import stores from './stores';

import {
  getBatchGlobalConfig,
  setBatchGlobalConfig,
  setPageEngineMenuType,
} from '@lib/api/user-config';
import toast from '@lib/toast';
import SimpleViewRenders from '@c/simple-view-render';

import { getSchemaKey } from './utils';
import store from '../app-details/store';

export const PG_SAVED_PREFIX = 'pge-';
export const PG_DRAFT_PREFIX = 'pge-draft-';
export const PG_VERSION = '1.0.0';

type Option={
  draft?: boolean;
  [key: string]: any
}

export function savePage(schemaID: string, page_schema: any, options?: Option): Promise<any> {
  return setBatchGlobalConfig([{
    key: options?.draft ? `${schemaID}:draft` : schemaID,
    version: PG_VERSION,
    value: typeof page_schema === 'object' ? JSON.stringify(page_schema) : page_schema,
  }]);
}

export function getPage(schemaID: string, options?: Option): Promise<string | void> {
  const queryId = getSchemaKey(schemaID, !!options?.draft);
  const result = getBatchGlobalConfig([{
    key: queryId,
    version: PG_VERSION,
  }]);

  return Promise.all([result]).then(([{ result }]) => {
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

export function updatePageEngineMenuType(appID: string, id: string): void {
  setPageEngineMenuType(appID, id).then((res) => {
    store.setActiveMenu({ ...store.curPage, menuType: 3 });
  }).catch((err) => toast.error(err));
}
