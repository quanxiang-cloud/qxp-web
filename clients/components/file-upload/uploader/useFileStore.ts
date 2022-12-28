import FileStore from './store';
import type { FileStoreProps } from './store';

export default function useFileStore( props: FileStoreProps): FileStore {
  return new FileStore(props);
}
