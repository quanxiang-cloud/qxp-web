import type { Artery, Node } from '@one-for-all/artery';
import { PropsSpec } from '@one-for-all/node-carve';
import { createContext, useContext } from 'react';

export interface UpdateAttrPayloadType {
  path: string;
  type?: 'normal' | 'loopNode';
}
export interface ConfigContextState {
  artery: Artery;
  activeNode: Node | undefined;
  rawActiveNode: Node | null;
  updateAttrPayload: UpdateAttrPayloadType | null;
  packagePropsSpec: PropsSpec | undefined;
  onArteryChange: (artery: Artery) => void;
  setUpdateAttrPayload: (val: UpdateAttrPayloadType) => void;
  setModalBindStateOpen: (visible: boolean) => void;
  setModalComponentNodeOpen: (visible: boolean) => void;
}

export const ConfigContext = createContext<ConfigContextState | null>(null);

export const useConfigContext = function(): ConfigContextState | null {
  return useContext(ConfigContext);
};
