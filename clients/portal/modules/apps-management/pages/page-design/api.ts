import { getStore } from '@ofa/page-engine';

import {
  setBatchGlobalConfig,
  getBatchGlobalConfig,
  setPageEngineMenuType,
} from '@lib/api/user-config';
import toast from '@lib/toast';

import store from '../app-details/store';

export const PG_SAVED_PREFIX = 'pge-';
export const PG_DRAFT_PREFIX = 'pge-draft-';
export const PG_VERSION = '0.1.0';

type Option={
  draft?: boolean;
  [key: string]: any
}

export function getSchemaKey(app_id: string, page_id: string, isDraft?: boolean) {
  return [isDraft ? PG_DRAFT_PREFIX : PG_SAVED_PREFIX, [app_id, page_id].join('__')].join('@');
}

export function savePage(app_id: string, page_id: string, page_schema: any, options?: Option): Promise<any> {
  return setBatchGlobalConfig([{
    key: getSchemaKey(app_id, page_id, options?.draft),
    version: PG_VERSION,
    value: typeof page_schema === 'object' ? JSON.stringify(page_schema) : page_schema,
  }]);
}

export function getPage(app_id: string, page_id: string, options?: Option) {
  const queryId = getSchemaKey(app_id, page_id, options?.draft);
  return getBatchGlobalConfig([{
    key: queryId,
    version: PG_VERSION,
  }])
    .then(({ result })=> {
      return result[queryId];
    })
    .catch((err)=> toast.error(err.message));
}

export function getVersionKey(): string {
  return PG_VERSION;
}

export function getRenderRepository(): any {
  const pageCtx = getStore();
  return {
    'ofa-ui@latest': pageCtx.registry.toComponentMap(),
  };
}

export function updatePageEngineMenuType(appID: string, id: string) {
  setPageEngineMenuType(appID, id).then((res) => {
    store.setActiveMenu({ ...store.curPage, menuType: 3 });
  }).catch((err) => toast.error(err));
}
