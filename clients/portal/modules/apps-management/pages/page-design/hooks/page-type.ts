import { useGetGlobalConfig } from '@lib/configuration-center';
import { getSchemaKey } from '../utils';

export function usePageTypeKey(appID: string, pageId: string): { pageType: string; isLoading: boolean; } {
  const key = getSchemaKey(appID, pageId, false);
  const [editor, loading] = useGetGlobalConfig(key, '1.0.0', '');
  return { pageType: editor, isLoading: loading };
}
