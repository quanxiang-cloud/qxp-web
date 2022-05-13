import { MoveLocationType } from './index';
import { createContext, useContext } from 'react';
import type { Node } from '@one-for-all/artery';

export interface OutLineContextState {
  moveToById(sourceId: string, targetId: string, location: MoveLocationType): void;
  rootNodeId: string;
  activeNodeId?: string;
  setActiveNode?: (node?: Node) => void;
}

export const OutLineContext = createContext<OutLineContextState | undefined>(undefined);

export function useOutLineContext(): OutLineContextState | undefined {
  return useContext(OutLineContext);
}
