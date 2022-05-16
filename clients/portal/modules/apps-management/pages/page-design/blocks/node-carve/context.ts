import type { Artery, Node } from '@one-for-all/artery';
import { createContext, useContext } from 'react';

import type { PropsSpecMap } from '@pageDesign/utils/package';

export interface UpdateAttrPayloadType {
  path: string;
  type?: 'normal' | 'loopNode';
}
export interface ConfigContextState {
  artery: Artery;
  activeNode: Node | undefined;
  rawActiveNode: Node | null;
  updateAttrPayload: UpdateAttrPayloadType | null;
  packagePropsSpec: PropsSpecMap | undefined;
  onArteryChange: (artery: Artery) => void;
  setUpdateAttrPayload: (val: UpdateAttrPayloadType) => void;
  setModalBindStateOpen: (visible: boolean) => void;
  setModalComponentNodeOpen: (visible: boolean) => void;
}

export const ConfigContext = createContext<ConfigContextState | null>(null);

export const useConfigContext = function(): ConfigContextState | null {
  return useContext(ConfigContext);
};
