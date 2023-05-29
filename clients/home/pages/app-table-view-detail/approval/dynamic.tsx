import React from 'react';

import Timeline from '@c/timeline';

import DirectLeaderApproval from '@home/pages/approvals/detail/dynamic-info';
import WarnTips from '@home/pages/approvals/detail/components/warn-tips';
import CarbonCopy from '@home/pages/approvals/detail/dynamic/carbon-copy';
import Approval from '@home/pages/approvals/detail/dynamic/approval';
import Fill from '@home/pages/approvals/detail/dynamic/fill';
import Deliver from '@home/pages/approvals/detail/dynamic/deliver';
import Reading from '@home/pages/approvals/detail/dynamic/reading';
import NoApprovalStatus from '@home/pages/approvals/detail/dynamic/no-approval-status';

interface Props {
  data: any;
  onTaskEnd?: (end: boolean) => void;
}

export default function ProcessHistory(props: Props) {
  const { data } = props;
  const [showType, setShowType] = React.useState<'list' | 'detail'>('list');
  const [currWork, setCurrWork] = React.useState<any>({});

  function changeType(type: 'list' | 'detail'): void {
    setShowType(type);
  }

  function clickHandle(workData: FlowItem): void {
    changeType('detail');
    setCurrWork(workData);
  }

  function handleContent(flow: FlowItem): JSX.Element {
    const { taskType } = flow;

    if (['OR_APPROVAL', 'AND_APPROVAL', 'FILL'].includes(taskType)) {
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

  return (
    <>
      {
        showType === 'list' && (
          <Timeline>
            {
              data?.map((flow: FlowItem, index: number) => {
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
    </>
  );
}
