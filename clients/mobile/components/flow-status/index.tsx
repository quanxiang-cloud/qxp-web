import React, { useEffect } from 'react';
import { Props } from '@m/qxp-ui-mobile';
import { useSetState } from 'react-use';
import cs from 'classnames';

import './index.scss';

export const allStatus: {
  [key: string]: string
} = {
  REVIEW: '进行中',
  IN_REVIEW: '进行中',
  AGREE: '已通过',
  REFUSE: '已拒绝',
  CANCEL: '已撤销',
  COMPLETE: '已完成',
  SEND_BACK: '待补充',
  ABANDON: '已作废',
  ABEND: '异常结束',
  // Add wait for handle status
  'REVIEW-REVIEW': '待审批',
  'IN_REVIEW-REVIEW': '待审批',

  'REVIEW-WRITE': '待填写',
  'IN_REVIEW-WRITE': '待填写',

  'REVIEW-READ': '待阅示',
  'IN_REVIEW-READ': '待阅示',
  // Add custom status for flow status detail page
  UNTREATED: '待处理',
  UNREAD: '待阅示',
};

export interface FlowStatusProps extends Props {
  desc?: string;
  status?: string;
}

export default function FlowStatus({ desc, status, className, style }: FlowStatusProps): JSX.Element | null {
  const [state, setState] = useSetState({ title: '', statusStyle: '' });

  useEffect(() => {
    if (!status) return;
    let key = `${status}-${desc}`;
    let title = allStatus[key];
    if (!title) {
      key = status;
      title = allStatus[key];
    }
    setState({ title: title || status, statusStyle: key });
  }, [desc, status]);

  if (!state.title) return null;

  return (
    <div style={style}
      className={cs(`body2 text-placeholder flow-status flow-status-${state.statusStyle}`, className)}>
      {state.title}
    </div>
  );
}
