import { useGetGlobalConfig } from '@lib/configuration-center';
import { getArteryKeys } from '../utils';

export function usePageTypeKey(arteryID: string): { pageType: string; isLoading: boolean; } {
  const [key] = getArteryKeys(arteryID, false);
  const [editor, loading] = useGetGlobalConfig(key, '1.0.0', '');
  return { pageType: editor, isLoading: loading };
}
