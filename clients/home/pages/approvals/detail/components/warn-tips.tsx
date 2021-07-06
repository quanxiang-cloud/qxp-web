import React from 'react';

import Icon from '@c/icon';

type Status = 'overtime' | 'jump' | 'handle';

const StatusText: Record<Status, string> = {
  overtime: '超时未处理，已自动跳至“设计部填写',
  jump: '该节点下无相关负责人，已自动跳过',
  handle: '该节点下无相关负责人，已交给管理员处理',
};

interface Props {
  status: Status;
}

export default function WarnTips({ status }: Props) {
  const text = StatusText[status];
  return (
    <div className="mt-8 px-16 py-8 bg-white text-yellow-600 text-12 flex">
      <div className="h-20 flex justify-center items-center"><Icon name="info" /></div>
      <div className="ml-4">{text}</div>
    </div>
  );
}
