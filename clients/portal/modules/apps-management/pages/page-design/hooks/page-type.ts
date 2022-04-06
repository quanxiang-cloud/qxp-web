import { useGetGlobalConfig } from '@lib/configuration-center';
import { getSchemaKey } from '../utils';

export function usePageTypeKey(schemaID: string): { pageType: string; isLoading: boolean; } {
  const key = getSchemaKey(schemaID, false);
  const [editor, loading] = useGetGlobalConfig(key, '1.0.0', '');
  return { pageType: editor, isLoading: loading };
}
