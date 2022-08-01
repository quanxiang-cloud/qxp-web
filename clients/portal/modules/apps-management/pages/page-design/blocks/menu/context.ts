import type { Artery } from '@one-for-all/artery';
import { createContext, useContext } from 'react';

interface MenuContextState {
  artery: Artery;
  onArteryChange: (artery: Artery) => void;
}

export const MenuContext = createContext<MenuContextState | undefined>(undefined);

export function useMenuContext(): MenuContextState | undefined {
  return useContext(MenuContext);
}
