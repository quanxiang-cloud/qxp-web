import React, { useState } from 'react';
import { Panel } from '@one-for-all/ui';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import type { Package } from '@pageDesign/blocks/menu/type';
import { GROUP_TITLE_MAP } from '@pageDesign/blocks/menu/constants';

import ComponentsSource from './components-source';
import PageTree from './page-tree';
import DataSource from './data-source';

interface Props {
  current: string;
  pinned: boolean;
  onClose: () => void;
  togglePinned: () => void;
  onAddNode: () => void;
  width?: number;
}

const GroupTypeContent = (props: Props): JSX.Element => {
  const [currentPackage, setCurrentPackage] = useState<Package | undefined>();
  const { current, onClose, pinned, togglePinned, onAddNode, width } = props;

  return (
    <Panel
      title={GROUP_TITLE_MAP[current]}
      style={{ transform: 'translateX(55px)' }}
      onClose={onClose}
      onPin={togglePinned}
      visible={!!current}
      pinned={pinned}
      width={width}
      closable
      pinnable
    >
      {current === 'comps' && (
        <ComponentsSource
          onAddNode={onAddNode}
          currentPackage={currentPackage}
          onChangePackage={setCurrentPackage}
        />
      )}
      {current === 'page_tree' && (
        <DndProvider backend={HTML5Backend}>
          <PageTree />
        </DndProvider>
      )}
      {current === 'data_source' && (
        <DataSource />
      )}
    </Panel>
  );
};

export default GroupTypeContent;
