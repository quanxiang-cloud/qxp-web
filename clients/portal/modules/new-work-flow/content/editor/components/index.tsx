import React from 'react';
import { groupBy } from 'ramda';

import { toggleNodeForm } from '../store';
import Drawer from '../forms/drawer';
import DragNode from './drag-node';
import { nodeLists, groupType2WeightMap, groupType2NameMap, nodeMenu } from '../utils/constants';

type Props = {
  triggerMode: string;
  nodeIdForDrawerForm: string;
}

export default function ComponentsSelector({ nodeIdForDrawerForm, triggerMode }: Props): JSX.Element {
  const _nodeLists = triggerMode === 'FORM_DATA' ? nodeLists : getNodeLists();

  const groupedNodeMap = groupBy((node) => node.groupType, _nodeLists);

  const groupedNodeList = Object.entries(groupedNodeMap).sort(
    ([groupType], [bGroupType]) => groupType2WeightMap[groupType] - groupType2WeightMap[bGroupType],
  );

  function getNodeLists(): any[] {
    return nodeLists.filter(({ type }) => nodeMenu[triggerMode]?.includes(type));
  }

  return (
    <>
      {nodeIdForDrawerForm === 'components' && (
        <Drawer
          title={(
            <div>
              <span className="text-h5 mr-16">选择一个组件</span>
              <span className="text-caption text-underline">💡 了解组件</span>
            </div>
          )}
          distanceTop={0}
          onCancel={() => toggleNodeForm('')}
          className="flow-editor-drawer flow-editor-drawer-components"
        >
          {groupedNodeList.map(([groupType, nodeList]) => (
            <div key={groupType}>
              <div className="text-caption-no-color text-gray-400 mt-24 mb-12">
                {groupType2NameMap[groupType]}
              </div>
              <div className="grid grid-cols-2 gap-16">
                {nodeList.map((node) => (
                  <DragNode
                    {...node}
                    key={node.text}
                    width={200}
                    height={72}
                  />
                ))}
              </div>
            </div>
          ))}
        </Drawer>
      )}
    </>
  );
}
