import {
  setBatchGlobalConfig,
  getBatchGlobalConfig,
} from '@lib/api/user-config';

import toast from '@lib/toast';

export const PG_SAVED_PREFIX = 'pge-';
export const PG_DRAFT_PREFIX = 'pge-draft-';
export const PG_VERSION = 'v0.1.0';

type Option={
  draft?: boolean;
  [key: string]: any
}

function getPageQueryId(app_id: string, page_id: string, isDraft?: boolean) {
  return [isDraft ? PG_DRAFT_PREFIX : PG_SAVED_PREFIX, [app_id, page_id].join('__')].join('@');
}

export function savePage(app_id: string, page_id: string, page_schema: any, options?: Option): Promise<any> {
  return setBatchGlobalConfig([{
    key: getPageQueryId(app_id, page_id, options?.draft),
    version: PG_VERSION,
    value: typeof page_schema === 'object' ? JSON.stringify(page_schema) : page_schema,
  }]);
}

export function getPage(app_id: string, page_id: string, options?: Option) {
  const queryId = getPageQueryId(app_id, page_id, options?.draft);
  return getBatchGlobalConfig([{
    key: queryId,
    version: PG_VERSION,
  }])
    .then(({ result })=> {
      return result[queryId];
    })
    .catch((err)=> toast.error(err.message));
}
