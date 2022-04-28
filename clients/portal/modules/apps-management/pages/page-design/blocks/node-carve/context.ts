import type { Artery, Node } from '@one-for-all/artery';
import { createContext, useContext } from 'react';

export interface NodeAttrType {
  path: string;
  type?: 'normal' | 'loopNode';
}
export interface ConfigContextState {
  activeNode: Node | undefined;
  rawActiveNode: Node | null;
  nodeAttr: NodeAttrType | null;
  artery: Artery;
  onArteryChange: (artery: Artery) => void;
  setNodeAttr: (val: NodeAttrType) => void;
  setModalBindStateOpen: (visible: boolean) => void;
  setModalComponentNodeOpen: (visible: boolean) => void;
}

export const ConfigContext = createContext<ConfigContextState | null>(null);

export const useConfigContext = function(): ConfigContextState | null {
  return useContext(ConfigContext);
};
