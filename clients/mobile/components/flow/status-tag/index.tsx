import React, { useMemo } from 'react';
import cs from 'classnames';

import { Props } from '@m/qxp-ui-mobile';

type Colors = 'text-blue-600' | 'text-green-600' | 'text-red-600' | 'text-yellow-600' | 'text-secondary';
type BgColors = 'bg-blue-100' | 'bg-green-100' | 'bg-red-100' | 'bg-yellow-100' | 'bg-gray-100';

type StatusStyle = {
  style: {
    color: Colors;
    bgColor: BgColors;
  };
  text: string;
}

type Status = Record<string, StatusStyle>;

const approvalStatus: Status = {
  FILL_IN: { style: { color: 'text-blue-600', bgColor: 'bg-blue-100' }, text: '完成填写' },
  FILL: { style: { color: 'text-blue-600', bgColor: 'bg-blue-100' }, text: '完成填写' },
  AGREE: { style: { color: 'text-green-600', bgColor: 'bg-green-100' }, text: '审批通过' },
  REFUSE: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '审批拒绝' },
  SEND_BACK: { style: { color: 'text-yellow-600', bgColor: 'bg-yellow-100' }, text: '打回重填' },
  READ: { style: { color: 'text-blue-600', bgColor: 'bg-blue-100' }, text: '已阅示' },
  DELIVER: { style: { color: 'text-blue-600', bgColor: 'bg-blue-100' }, text: '转交' },
  STEP_BACK: { style: { color: 'text-yellow-600', bgColor: 'bg-yellow-100' }, text: '已回退' },
  UNTREATED: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '未处理' },
  IN_REVIEW: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '审批中' },
  AUTO_REVIEW: { style: { color: 'text-green-600', bgColor: 'bg-green-100' }, text: '审批通过' },
  AUTO_SKIP: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '已跳过' },
  CANCEL: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '已撤销' },
  RE_SUBMIT: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '再次提交' },
  CC: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '抄送' },
  ABEND: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '异常结束' },
  ABANDON: { style: { color: 'text-secondary', bgColor: 'bg-gray-100' }, text: '已作废' },
  AUTO_REVIEW_DETAIL: { style: { color: 'text-secondary', bgColor: 'bg-gray-100' }, text: '自动处理' },
};

export interface StatusTagProps extends Props {
  status: string;
  autoReview?: boolean;
}

const statusTagStyle = {
  padding: '0 .06rem',
  borderRadius: '.04rem 0',
};

export default function StatusTag(props: StatusTagProps): JSX.Element {
  const statusData = useMemo<StatusStyle>(
    () => approvalStatus[props.status] || { style: { color: '', bgColor: '' }, text: '' },
    [props.status],
  );

  return (
    <div className='flex'>
      {props.autoReview && ('AUTO_REVIEW' === props.status || 'AUTO_SKIP' === props.status) && (
        <div
          className={cs('body2 text-secondary mr-8 bg-gray-100', props.className)}
          style={statusTagStyle}
        >
          自动处理
        </div>
      )}

      <div
        className={cs('body2', props.className, statusData.style.bgColor, statusData.style.color)}
        style={statusTagStyle}
      >
        {statusData.text}
      </div>
    </div>
  );
}
