import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useQuery } from 'react-query';

import Loading from '@c/loading';
import Timeline from '@c/timeline';
import ErrorTips from '@c/error-tips';

import NoApprovalStatus from './no-approval-status';
import Approval from './approval';
import Fill from './fill';
import DirectLeaderApproval from '../dynamic-info';
import Deliver from './deliver';
import Reading from './reading';
import CarbonCopy from './carbon-copy';
import WarnTips from '../components/warn-tips';
import * as apis from '../../api';

interface Props {
  onTaskEnd: (end: boolean) => void;
}

export default function ProcessHistory(props: Props) {
  const { processInstanceID } = useParams<{ processInstanceID: string }>();
  const [showType, setShowType] = React.useState<'list' | 'detail'>('list');
  const [currWork, setCurrWork] = React.useState<any>({});

  const {
    isLoading, data, isError,
  } = useQuery<any, Error>(
    [processInstanceID, 'GET_PROCESS_HISTORIES'],
    () => apis.getProcessHistories(processInstanceID),
  );

  useEffect(() => {
    if (Array.isArray(data) &&
      data.some((v: { taskType: string, status: string }) => v.taskType === 'END' && v.status === 'END')) {
      props.onTaskEnd(true);
    }
  }, [data]);

  function changeType(type: 'list' | 'detail'): void {
    setShowType(type);
  }

  function clickHandle(workData: FlowItem): void {
    changeType('detail');
    setCurrWork(workData);
  }

  function handleContent(flow: FlowItem): JSX.Element {
    const { taskType } = flow;

    if (['OR_APPROVAL', 'AND_APPROVAL'].includes(taskType)) {
      return <Approval workData={flow} clickHandle={clickHandle} />;
    }

    if (['OR_FILLIN', 'AND_FILLIN'].includes(taskType)) {
      return <Fill workData={flow} clickHandle={clickHandle} />;
    }

    if (taskType === 'CC') {
      return <CarbonCopy workData={flow} clickHandle={clickHandle} />;
    }

    if (taskType === 'DELIVER') {
      return <Deliver workData={flow} />;
    }

    if (taskType === 'READ') {
      return <Reading workData={flow} clickHandle={clickHandle} />;
    }

    if (['AUTO_SKIP', 'AUTO_REVIEW'].includes(taskType)) {
      return <WarnTips workData={flow} />;
    }

    return <NoApprovalStatus workData={flow} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorTips desc='获取数据失败' />;
  }

  return (
    <div className="mt-16">
      {
        showType === 'list' && (
          <Timeline>
            {
              data.map((flow: FlowItem, index: number) => {
                const { taskType } = flow;
                let color = '';
                if (index === 0) {
                  color = 'var(--blue-600)';
                }
                if (taskType === 'END') {
                  color = 'var(--red-600)';
                }
                return (
                  <Timeline.Item key={index} color={color}>
                    {handleContent(flow)}
                  </Timeline.Item>
                );
              })
            }
          </Timeline>
        )
      }
      {
        showType === 'detail' && (
          <DirectLeaderApproval
            returnFlowPage={() => changeType('list')}
            workData={currWork} />
        )
      }
    </div>
  );
}
