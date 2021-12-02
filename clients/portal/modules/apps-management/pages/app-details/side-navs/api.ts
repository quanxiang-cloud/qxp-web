import httpClient from '@lib/http-client';
import { parseJSON } from '@lib/utils';
import type { Menu } from './index';

const PORTAL_SIDE_NAV_EXTERNAL_LINKS = 'PORTAL_SIDE_NAV_EXTERNAL_LINKS';

export function fetchSideNavExternalLinks(): Promise<Menu[]> {
  return httpClient<{ result: Record<string, string>; }>('/api/v1/persona/batchGetValue', {
    keys: [{ version: '0.0.1', key: PORTAL_SIDE_NAV_EXTERNAL_LINKS }],
  }).then(({ result }) => {
    return parseJSON<Menu[]>(result[PORTAL_SIDE_NAV_EXTERNAL_LINKS], []);
  }).catch(() => {
    return [];
  });
}
