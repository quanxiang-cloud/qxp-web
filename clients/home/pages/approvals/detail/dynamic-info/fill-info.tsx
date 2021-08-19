import React from 'react';

import Icon from '@c/icon';

import NoHandle from './common/no-handle';
import Handled from './common/handled';
import HandleInfo from './common/handle-info';

type StatusDescribe = Record<string, {text: string, describe: string}>;
type DataClassify = Record<'handledData' | 'noHandleData', OperationRecord[]>;

const statusDescribe: StatusDescribe = {
  OR_FILLIN: { text: '任填', describe: '任意一位负责人填写即可通过' },
  AND_FILLIN: { text: '会填', describe: '需全部负责人填写方可通过' },
};

interface Props {
  workData: FlowItem;
  returnFlowPage(): void;
}

export default function FillInfo({ workData, returnFlowPage }: Props): JSX.Element {
  const { operationRecords, taskName, taskType, status } = workData;

  const isNoFinish = ['REVIEW', 'IN_REVIEW'].includes(status);

  function dataClassify(data: OperationRecord[]): DataClassify {
    const newData: DataClassify = {
      handledData: [],
      noHandleData: [],
    };
    data.map((operation: OperationRecord) => {
      if (['UNTREATED', 'REVIEW'].includes(operation.handleType)) {
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
        <div className="text-h5-bold ml-12">{taskName} · {operationRecords.length}</div>
      </div>
      <div className="py-16">
        {
          isNoFinish && (
            <div className="mb-16 text-yellow-600 text-12 flex">
              <div className="h-20 flex justify-center items-center"><Icon name="info" /></div>
              <div className="ml-4">{statusDescribe[taskType].text}：{statusDescribe[taskType].describe}</div>
            </div>
          )
        }
        {
          (isNoFinish && noHandleData.length > 0) && (
            noHandleData.map((data: OperationRecord, index: number) => (
              <NoHandle key={index} operation={data} />
            ))
          )
        }
        {
          handledData.length > 0 && (
            <>
              <div className="mb-16 text-12 text-gray-600">已处理</div>
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
        { (!isNoFinish && noHandleData.length > 0) && (
          <>
            <div className="mb-16 text-12 text-gray-600">工作流任务已结束，以下负责人未处理</div>
            {
              noHandleData.map((data: OperationRecord, index: number) => (
                <Handled key={index} operation={data} />
              ))
            }
          </>
        )
        }
      </div>
    </div>
  );
}
