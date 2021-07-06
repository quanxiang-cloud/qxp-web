import React from 'react';

import ApprovalInfo from './approval-info';
import FillInfo from './fill-info';
import Invited from './invited-read';
import Copied from './copied';

interface Props {
  workData: FlowItem;
  returnFlowPage(): void;
}

export default function Index({ workData, returnFlowPage }: Props): JSX.Element {
  const { taskType } = workData;

  function handleShow(): JSX.Element {
    if (['OR_APPROVAL', 'AND_APPROVAL'].includes(taskType)) {
      return <ApprovalInfo workData={workData} returnFlowPage={returnFlowPage} />;
    }

    if (['OR_FILLIN', 'AND_FILLIN'].includes(taskType)) {
      return <FillInfo workData={workData} returnFlowPage={returnFlowPage} />;
    }

    if (taskType === 'CC') {
      return <Copied workData={workData} returnFlowPage={returnFlowPage} />;
    }

    if (taskType === 'READ') {
      return <Invited workData={workData} returnFlowPage={returnFlowPage} />;
    }

    return <div></div>;
  }

  return handleShow();
}
