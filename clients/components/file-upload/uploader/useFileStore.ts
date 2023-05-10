import { useEffect, useState } from 'react';
import FileStore from './store';
import type { FileStoreProps } from './store';

export default function useFileStore(props: FileStoreProps): FileStore {
  const [store, setStore] = useState<FileStore>(new FileStore(props));
  useEffect(()=>{
    setStore(new FileStore(props));
  }, [props.files.length]);
  return store;
}
