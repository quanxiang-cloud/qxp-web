import React from 'react';
import cs from 'classnames';
import { MsgSendStatus } from '@portal/modules/system-mgmt/constants';
import { Tooltip } from '@QCFE/lego-ui';

import styles from './index.module.scss';

interface Props {
  className?: string;
  status: MsgSendStatus;
  fail: number,
  success: number
}

const statusMap = {
  [MsgSendStatus.draft]: '草稿',
  [MsgSendStatus.sending]: '发送中',
  [MsgSendStatus.success]: '已成功',
};

const MsgStatus = ({ className, status, fail, success }: Props): JSX.Element => {
  const sendInfo = status !== MsgSendStatus.success ? null : (
    <span className={fail == 0 ? styles.simple_text : styles.warning_text}>
      &nbsp;({ success}/{success + fail}人)
    </span>
  );

  const baseInfo = (<div className={cs(styles.status, 'inline-flex align-center', className)}>
    <span className={cs('mr-10', styles.indicator, {
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

  const msg = fail == 0 ? `共${success}人, 已全部发送` :
    `共 ${fail + success} 人, 发送失败${fail}人, 发送成功${success}人`;

  return (
    <Tooltip content={<span>{msg}</span>} trigger="hover">
      <div>{baseInfo}</div>
    </Tooltip>
  );
};

export default MsgStatus;
