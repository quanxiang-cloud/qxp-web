import { useState } from 'react';
import FileStore from './store';
import type { FileStoreProps } from './store';

export default function useFileStore(props: FileStoreProps): FileStore {
  const [store] = useState<FileStore>(new FileStore(props));
  return store;
}
