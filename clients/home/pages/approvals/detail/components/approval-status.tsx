import React from 'react';
import classNames from 'classnames';

type Status = Record<StatusValues, { style: {
  color: Colors,
  bgColor: BgColors
}, text: string}>;

const approvalStatus: Status = {
  FILL_IN: { style: { color: 'text-blue-600', bgColor: 'bg-blue-100' }, text: '完成填写' },
  AGREE: { style: { color: 'text-green-600', bgColor: 'bg-green-100' }, text: '审批通过' },
  REFUSE: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '审批拒绝' },
  SEND_BACK: { style: { color: 'text-yellow-600', bgColor: 'bg-yellow-100' }, text: '打回重填' },
  READ: { style: { color: 'text-blue-600', bgColor: 'bg-blue-100' }, text: '已阅示' },
  DELIVER: { style: { color: 'text-blue-600', bgColor: 'bg-blue-100' }, text: '转交' },
  STEP_BACK: { style: { color: 'text-yellow-600', bgColor: 'bg-yellow-100' }, text: '已回退' },
  UNTREATED: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '未处理' },
  IN_REVIEW: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '审批中' },
  AUTO_REVIEW: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '自动审批' },
  AUTO_SKIP: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '跳过' },
  CANCEL: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '撤销' },
  RE_SUBMIT: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '再次提交' },
  CC: { style: { color: 'text-red-600', bgColor: 'bg-red-100' }, text: '抄送' },
};

interface Props {
  status: StatusValues
}

export default function ApprovalStatus({ status }: Props) {
  const value = approvalStatus[status] || { style: { color: '', bgColor: '', text: '' } };
  return (
    <div className={classNames('text-center leading-24 cursor-pointer text-12 px-6 corner-4-0-4-0',
      value.style.bgColor, value.style.color)}>
      {value.text}
    </div>
  );
}
