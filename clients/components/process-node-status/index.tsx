import React from 'react';
import cs from 'classnames';

import './index.scss';

type StatusValue = 'REVIEW' | 'IN_REVIEW' | 'AGREE' | 'REFUSE' | 'CANCEL' | 'COMPLETE' | 'SEND_BACK';

interface Props {
  className?: string;
  label?: string;
  value?: StatusValue;
}

const statusMap = {
  REVIEW: '待审批',
  IN_REVIEW: '审批中',
  AGREE: '通过',
  REFUSE: '拒绝',
  CANCEL: '取消',
  COMPLETE: '完成',
  SEND_BACK: '待补充',
};

function Status({ label, value, className }: Props): JSX.Element {
  return (
    <div className={cs('status inline-flex items-center', className)}>
      <span className={cs('status-indicator mr-4', `status-indicator-${value?.toLowerCase()}`)} />
      <span className="status-label">{label || statusMap[value as StatusValue]}</span>
    </div>
  );
}

export default Status;
