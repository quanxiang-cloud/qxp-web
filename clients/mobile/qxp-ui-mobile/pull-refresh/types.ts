import React from 'react';

import { NumberString, Props } from '..';

export type LoadingType = 'circular' | 'spinner';

export type PullRefreshStatus = 'normal' | 'loading' | 'loosing' | 'pulling' | 'success';

export type StatusTextTypeRender = ({ distance }: { distance: number }) => React.ReactNode;

export type StatusTextType = React.ReactNode | StatusTextTypeRender;

export interface PullRefreshProps extends Props {
  disabled?: boolean;
  successText?: StatusTextType;
  pullingText?: StatusTextType;
  loosingText?: StatusTextType;
  loadingText?: StatusTextType;
  successDuration?: NumberString;
  animationDuration?: NumberString;
  headHeight?: NumberString;
  pullDistance?: NumberString;
  onRefresh: () => Promise<unknown> | void;
  children?: React.ReactNode;
}
