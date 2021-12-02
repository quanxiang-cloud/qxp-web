import React, { createContext, useContext, PropsWithChildren, useMemo, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { first } from 'lodash';

import orchestrationAPIStoreFactory, { OrchestrationAPIStore } from './store';
import APINamespaceTreeStore from './store/namespace';
import type { NameSpace } from './effects/api/api-namespace';
import { getNamespaceNodeSiblingNodes } from './utils';

type Props = PropsWithChildren<{ appID: string }>;
const OrchestrationAPIStoreContext = createContext<OrchestrationAPIStore | null>(null);
export function OrchestrationAPIStoreProvider({ children, appID }: Props): JSX.Element {
  const orchestrationApiStore = useMemo(() => orchestrationAPIStoreFactory(appID), [appID]);

  return (
    <OrchestrationAPIStoreContext.Provider value={orchestrationApiStore}>
      {children}
    </OrchestrationAPIStoreContext.Provider>
  );
}
export const useOrchestrationAPIStore = (): OrchestrationAPIStore | null => useContext(
  OrchestrationAPIStoreContext,
);

type APINamespaceStoreProviderProps = PropsWithChildren<{ root?: NameSpace; child: NameSpace[] }>;
const ApiNamespaceStoreContext = createContext<APINamespaceTreeStore | null | undefined>(null);
export function ApiNamespaceStoreProvider(
  { children, root, child }: APINamespaceStoreProviderProps,
): JSX.Element {
  const apiNamespaceStore = useMemo(() => root && new APINamespaceTreeStore(root, child), []);

  const orchestrationAPIStore = useOrchestrationAPIStore();
  const [nameSpaceID = '', setNameSpaceID] = useLocalStorage('portal.namespace.current.id', '');

  useEffect(() => {
    orchestrationAPIStore?.setNameSpaceStore(apiNamespaceStore);
  }, [apiNamespaceStore, orchestrationAPIStore]);

  useEffect(() => {
    const children = getNamespaceNodeSiblingNodes(apiNamespaceStore);
    if (!children?.length) {
      return;
    }
    const childrenIDList = children.map(({ id }) => id);
    let nodeID = first(childrenIDList);
    if (childrenIDList.includes(nameSpaceID)) {
      nodeID = nameSpaceID;
    }
    apiNamespaceStore?.onSelectNode(nodeID || '');
    nodeID !== nameSpaceID && setNameSpaceID(nodeID);
  }, [nameSpaceID, apiNamespaceStore?.rootNode.children]);

  return (
    <ApiNamespaceStoreContext.Provider value={apiNamespaceStore}>
      {children}
    </ApiNamespaceStoreContext.Provider>
  );
}
export const useApiNamespaceStore = (): APINamespaceTreeStore | null | undefined => useContext(
  ApiNamespaceStoreContext,
);
