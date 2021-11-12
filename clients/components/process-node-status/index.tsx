import React from 'react';
import cs from 'classnames';

import './index.scss';

export type StatusValue = 'REVIEW' | 'IN_REVIEW' | 'AGREE' | 'REFUSE' | 'CANCEL' | 'COMPLETE'
| 'SEND_BACK' | 'ABANDON' | 'ABEND' | 'REVIEW-REVIEW' | 'IN_REVIEW-REVIEW'
| 'REVIEW-WRITE' | 'IN_REVIEW-WRITE' | 'REVIEW-READ' | 'IN_REVIEW-READ';

interface Props {
  className?: string;
  label?: string;
  value?: StatusValue | undefined;
}

const statusMap = {
  REVIEW: '进行中',
  IN_REVIEW: '进行中',
  AGREE: '通过',
  REFUSE: '拒绝',
  CANCEL: '取消',
  COMPLETE: '完成',
  SEND_BACK: '待补充',
  ABANDON: '作废',
  ABEND: '异常结束',
  'REVIEW-REVIEW': '待审批',
  'IN_REVIEW-REVIEW': '待审批',
  'REVIEW-WRITE': '待填写',
  'IN_REVIEW-WRITE': '待填写',
  'REVIEW-READ': '待阅示',
  'IN_REVIEW-READ': '待阅示',
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
