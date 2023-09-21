import React from 'react';

import Icon from '@c/icon';

import NoRead from './common/no-read';
import HandleInfo from './common/handle-info';

interface Props {
  workData: FlowItem;
  returnFlowPage(): void;
}

type DataClassify = Record<'handledData' | 'noHandleData', OperationRecord[]>;

export default function Index({ workData, returnFlowPage }: Props): JSX.Element {
  const { operationRecords } = workData;

  function dataClassify(data: OperationRecord[]): DataClassify {
    const newData: DataClassify = {
      handledData: [],
      noHandleData: [],
    };
    data.map((operation: OperationRecord) => {
      if (operation.status === 'ACTIVE') {
        newData.noHandleData.push(operation);
      } else {
        newData.handledData.push(operation);
      }
    });

    return newData;
  }

  const _data = dataClassify(operationRecords);
  const { handledData, noHandleData } = _data;

  return (
    <div>
      <div className="flex items-center border-b pb-14">
        <Icon name="keyboard_backspace" size={20} onClick={returnFlowPage} />
        <div className="text-h5-bold ml-12">已邀请以下人员阅示 · {operationRecords.length}</div>
      </div>
      <div className="py-16">
        {
          noHandleData.length > 0 && noHandleData.map((operation, index: number) => {
            return (
              <NoRead key={index} operation={operation} />
            );
          })
        }
        {
          handledData.length > 0 && (
            <>
              <div className="mb-16 text-12 text-gray-600">已阅示</div>
              <div className="flex flex-col">
                {
                  handledData.map((operation, index: number) => {
                    return (
                      <HandleInfo key={index} operation={operation} />
                    );
                  })
                }
              </div>
            </>
          )
        }
      </div>
    </div>
  );
}
