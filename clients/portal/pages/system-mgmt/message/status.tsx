import React from 'react';
import classNames from 'classnames';
import { MsgSendStatus } from '@portal/const/message';
// import { Popover } from '@c/popover'
import { Tooltip } from '@QCFE/lego-ui';

import styles from './index.module.scss';

interface Props {
  className?: string;
  status: MsgSendStatus;
  fail: number,
  success: number
}

const statusMap={
  [MsgSendStatus.draft]: '草稿',
  [MsgSendStatus.sending]: '发送中',
  [MsgSendStatus.success]: '已成功',
};

const MsgStatus = ({ className, status, fail, success }: Props) => {
  const sendInfo = status === MsgSendStatus.success ? <span className={fail == 0 ? styles.simple_text : styles.warning_text}>&nbsp;({ success }/{success + fail})</span> :null;

  const baseInfo = (<div className={classNames(styles.status, 'inline-flex align-center', className)}>
    <span className={classNames('mr-10', styles.indicator, {
      [styles.draft]: status === MsgSendStatus.draft,
      [styles.sending]: status === MsgSendStatus.sending,
      [styles.success]: status === MsgSendStatus.success,
    })}>
    </span>
    {/* @ts-ignore */}
    <span>{statusMap[status] || status}</span>
    {sendInfo}
  </div>);

  if (status !== MsgSendStatus.success) return <div>{baseInfo}</div>;

  const msg = fail == 0 ? `共${success}人, 已全部发送` :`共 ${fail+success} 人, 发送失败${fail}人, 发送成功${success}人`;

  return (<Tooltip content={<span>{msg}</span>} trigger="hover">
    <div>{baseInfo}</div>
  </Tooltip>);
};

export default MsgStatus;
