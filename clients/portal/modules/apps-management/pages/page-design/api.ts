import {
  setBatchGlobalConfig,
} from '@lib/api/user-config';

import { PG_SAVE_VERSION, getSaveKey } from './utils';

export function savePage(page_id: string, page_schema: any, options?: Record<string, any>): Promise<any> {
  return setBatchGlobalConfig([{
    key: getSaveKey(page_id),
    version: PG_SAVE_VERSION,
    value: JSON.stringify(page_schema),
  }]);
}

export function previewPage(page_schema: any): void {

}
