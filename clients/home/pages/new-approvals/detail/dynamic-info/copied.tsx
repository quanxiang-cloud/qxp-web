import React from 'react';

import Icon from '@c/icon';
import NoHandle from './common/handled';

interface Props {
  workData: FlowItem;
  returnFlowPage(): void;
}

export default function Index({ workData, returnFlowPage }: Props): JSX.Element {
  const { operationRecords } = workData;

  return (
    <div>
      <div className="flex items-center border-b pb-14">
        <Icon name="keyboard_backspace" size={20} onClick={returnFlowPage} />
        <div className="text-h5-bold ml-12">已抄送给以下人员 · {operationRecords.length}</div>
      </div>
      <div className="py-16">
        {
          operationRecords.map((operation, index: number) => {
            return (
              <NoHandle key={index} operation={operation} />
            );
          })
        }
      </div>
    </div>
  );
}
