import { useGetGlobalConfig } from '@lib/configuration-center';

import { getPageTypeKey } from '../utils';

export function usePageTypeKey(appID: string, pageId: string): { pageType: string; isLoading: boolean; } {
  const [key, newKey] = getPageTypeKey(appID, pageId);
  const [editor, loading] = useGetGlobalConfig(key, '1.0.0', '');
  const [newEditor, newLoading] = useGetGlobalConfig(newKey, '1.0.0', '');
  return { pageType: newEditor || editor, isLoading: newLoading || loading };
}
