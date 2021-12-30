import React from 'react';
import { groupBy } from 'ramda';

import useObservable from '@lib/hooks/use-observable';

import store, { toggleNodeForm } from '../store';
import type { StoreValue } from '../type';
import Drawer from '../forms/drawer';
import DragNode from './drag-node';
import { nodeLists, groupType2WeightMap, groupType2NameMap } from '../utils/constants';

export default function ComponentsSelector(): JSX.Element {
  const { nodeIdForDrawerForm } = useObservable<StoreValue>(store);

  const groupedNodeMap = groupBy((node) => node.groupType, nodeLists);

  const groupedNodeList = Object.entries(groupedNodeMap).sort(
    ([groupType], [bGroupType]) => groupType2WeightMap[groupType] - groupType2WeightMap[bGroupType],
  );

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
          className="flow-editor-drawer"
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
