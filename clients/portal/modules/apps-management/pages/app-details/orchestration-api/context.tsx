import React, { createContext, useContext, PropsWithChildren, useMemo, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { first } from 'lodash';

import { OrchestrationAPIStore } from './store';
import APINamespaceTreeStore from './store/namespace';
import { getNamespaceNodeSiblingNodes } from './utils';

type Props = PropsWithChildren<{ orchestrationApiStore: OrchestrationAPIStore }>;
const OrchestrationAPIStoreContext = createContext<OrchestrationAPIStore | null>(null);
export function OrchestrationAPIStoreProvider({ children, orchestrationApiStore }: Props): JSX.Element {
  return (
    <OrchestrationAPIStoreContext.Provider value={orchestrationApiStore}>
      {children}
    </OrchestrationAPIStoreContext.Provider>
  );
}
export const useOrchestrationAPIStore = (): OrchestrationAPIStore | null => useContext(
  OrchestrationAPIStoreContext,
);

export function useStore(
  { root, child }: APINamespaceStoreProviderProps, update?: boolean,
): APINamespaceTreeStore | undefined {
  const apiNamespaceStore = useMemo(
    () => root && new APINamespaceTreeStore(root, child),
    update ? [root, child] : [],
  );

  const [nameSpaceID = '', setNameSpaceID] = useLocalStorage('portal.namespace.current.id', '');

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

  return apiNamespaceStore;
}

type APINamespaceStoreProviderProps = PropsWithChildren<{ root?: PolyAPI.Namespace; child: PolyAPI.Namespace[] }>;
const ApiNamespaceStoreContext = createContext<APINamespaceTreeStore | null | undefined>(null);
export function ApiNamespaceStoreProvider(
  { children, root, child }: APINamespaceStoreProviderProps,
): JSX.Element {
  const apiNamespaceStore = useStore({ root, child });

  return (
    <ApiNamespaceStoreContext.Provider value={apiNamespaceStore}>
      {children}
    </ApiNamespaceStoreContext.Provider>
  );
}
export const useApiNamespaceStore = (): APINamespaceTreeStore | null | undefined => useContext(
  ApiNamespaceStoreContext,
);

const ApiNamespaceSearchStoreContext = createContext<APINamespaceTreeStore | null | undefined>(null);
export function ApiNamespaceSearchStoreProvider(
  { children, root, child }: APINamespaceStoreProviderProps,
): JSX.Element {
  const apiNamespaceSearchStore = useStore({ root, child }, true);

  return (
    <ApiNamespaceSearchStoreContext.Provider value={apiNamespaceSearchStore}>
      {children}
    </ApiNamespaceSearchStoreContext.Provider>
  );
}
export const useApiNamespaceSearchStore = (): APINamespaceTreeStore | null | undefined => useContext(
  ApiNamespaceSearchStoreContext,
);
