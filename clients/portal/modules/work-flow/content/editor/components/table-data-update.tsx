import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { get } from 'lodash';

import FlowContext from '@flow/flow-context';
import { getFormDataOptions } from '@c/form-table-selector/api';

import NodeComponentWrapper, { Props } from './node-component-wrapper';
import { filterTables } from '../forms/utils';

export default function TableDataUpdateNodeComponent(props: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const { data: allTables = [] } = useQuery(['GET_WORK_FORM_LIST', appID], () => getFormDataOptions(appID), {
    enabled: !!appID,
  });
  const targetTableId = get(props, 'data.businessData.targetTableId');
  const tableName = filterTables(allTables).find((v) => v.value === targetTableId)?.label || '';

  return (
    <NodeComponentWrapper {...props} iconName="update">
      <div className="bg-gray-100 py-4 px-8 rounded-4 flex flex-col justify-center w-full">
        目标表: {tableName}
      </div>
    </NodeComponentWrapper>
  );
}
