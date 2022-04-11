import { useGetGlobalConfig } from '@lib/configuration-center';

import { VERSION } from 'clients/constants';
import { getArteryKeys } from '../utils';

export function usePageTypeKey(arteryID: string): { pageType: string; isLoading: boolean; } {
  const [key] = getArteryKeys(arteryID, false);
  const [editor, loading] = useGetGlobalConfig(key, VERSION, '');
  return { pageType: editor, isLoading: loading };
}
