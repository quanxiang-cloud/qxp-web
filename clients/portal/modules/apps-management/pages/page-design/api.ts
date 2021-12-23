import { getStore } from '@ofa/page-engine';
import { Repository } from '@ofa/render-engine';

import {
  setBatchGlobalConfig,
  getBatchGlobalConfig,
  setPageEngineMenuType,
} from '@lib/api/user-config';
import toast from '@lib/toast';

import store from '../app-details/store';
import * as consts from './constant';

type Option={
  draft?: boolean;
  [key: string]: any
}

export function getSchemaKey(app_id: string, page_id: string, isDraft?: boolean) {
  return [isDraft ? consts.PG_DRAFT_PREFIX : consts.PG_SAVED_PREFIX, [app_id, page_id].join('__')].join('@');
}

export function savePage(app_id: string, page_id: string, page_schema: any, options?: Option): Promise<any> {
  return setBatchGlobalConfig([
    {
      key: getSchemaKey(app_id, page_id, options?.draft),
      version: consts.PG_VERSION,
      value: typeof page_schema === 'object' ? JSON.stringify(page_schema) : page_schema,
    },
    {
      key: consts.enableCreateCustomPage,
      version: consts.PG_VERSION,
      value: JSON.stringify(true),
    },
  ]);
}

export function getPage(app_id: string, page_id: string, options?: Option) {
  const queryId = getSchemaKey(app_id, page_id, options?.draft);
  const keys = [queryId, consts.enableCreateCustomPage].map((v)=> ({
    key: v,
    version: consts.PG_VERSION,
  }));

  return getBatchGlobalConfig(keys)
    .then(({ result })=> {
      return result[queryId];
    })
    .catch((err)=> toast.error(err.message));
}

export function getVersionKey(): string {
  return consts.PG_VERSION;
}

export function getRenderRepository(): Repository {
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
