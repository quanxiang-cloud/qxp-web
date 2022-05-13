import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import { faasState } from '../constants';

type stepProps = {
  step: number;
  onClick: () => void
}

export function Develop({
  step,
  userAccount,
  onClick,
}: stepProps & { userAccount: string }): JSX.Element {
  const isDevelop = (!(step < faasState.DEVELOP));
  return (
    <div className='ini-bar'>
      <div className={cs('bar-title', isDevelop ? 'ini-ok' : 'not-ini')}>
        <Icon name={isDevelop ? 'task-ok' : 'schedule'} size={20} className='mr-8' />
        {isDevelop ? '已绑定账号' : '未绑定账号'}
      </div>
      <div className='pl-16 my-20'>
        {isDevelop ? '当前账号已绑定 Git 仓库账号' : '当前未绑定 Git 仓库账号'}
      </div>
      <div className='ini-action'>
        <div className='text-btn' onClick={onClick}>{isDevelop ? '重新绑定' : '绑定'}</div>
        {userAccount && (
          <div className='ml-8 text-blue-600'>{`${userAccount} >`} </div>
        )}
      </div>
    </div>
  );
}

export function Group({ step, onClick }: stepProps): JSX.Element {
  console.log(step);
  const hasGroup = step > faasState.DEVELOP || step === faasState.NOT_DEVELOP_HAS_GROUP;
  return (

    <div className='ini-bar'>
      <div className={cs('bar-title', hasGroup ? 'ini-ok' : 'not-ini')}>
        <Icon name={hasGroup ? 'task-ok' : 'schedule'} size={20} className='mr-8' />
        {hasGroup ? '已绑定空间' : '未绑定空间'}
      </div>
      <div className='pl-16 my-20'>
        {hasGroup ? '当前应用已绑定 Git 仓库的 Group 空间' : '当前应用还未绑定 Git 仓库的 Group 空间'}
      </div>
      <div className={cs('ini-action', step === faasState.DEVELOP ? '' : 'cursor-not-allowed')}>
        <span
          className={step === faasState.DEVELOP ? 'text-btn' : 'pointer-events-none text-blue-400'}
          onClick={onClick}
        >
          绑定
        </span>
      </div>
    </div>
  );
}

export function AddInGroup({ step, onClick }: stepProps): JSX.Element {
  return (
    <div className='ini-bar'>
      <div className={cs('bar-title', step > faasState.GROUP ? 'ini-ok' : 'not-ini')}>
        <Icon name={step > faasState.GROUP ? 'task-ok' : 'schedule'} size={20} className='mr-8' />
        {step > faasState.GROUP ? '已加入空间' : '未加入空间'}
      </div>
      <div className='pl-16 my-20'>
        {step > faasState.GROUP ? '当前账号已经加入到Group空间' : '您还未加入该应用的 Group 空间'}
      </div>
      <div className={cs('ini-action', step === faasState.GROUP ? '' : 'cursor-not-allowed')}>
        <span
          className={step === faasState.GROUP ? 'text-btn' : 'pointer-events-none text-blue-400'}
          onClick={onClick}
        >
          加入协作
        </span>
      </div>
    </div>
  );
}
