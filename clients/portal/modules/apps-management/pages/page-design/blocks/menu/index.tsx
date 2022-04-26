import React from 'react';
import type { BlockItemProps } from '@one-for-all/artery-engine';

import type { BlocksCommunicationType } from '@pageDesign/types';

import Group from './group';
import { MenuContext } from './context';

import './index.scss';

function Menu(props: BlockItemProps<BlocksCommunicationType>): JSX.Element {
  const { artery, onChange } = props;
  const value = { artery, onArteryChange: onChange };

  return (
    <MenuContext.Provider value={value}>
      <Group {...props} />
    </MenuContext.Provider>
  );
}

export default Menu;
