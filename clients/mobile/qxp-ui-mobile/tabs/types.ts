import React, { CSSProperties } from 'react';

import { NumberString, Props } from '..';
import { StickyProps } from '../sticky';
import { BadgeSettingProps } from '../badge';

export interface TabsProps extends Props {
  color?: string;
  sticky?: boolean | StickyProps;
  animated?: boolean;
  canSwipe?: boolean;
  ellipsis?: boolean;
  lineClassName?: string;
  beforeChange?: (name: NumberString) => boolean | Promise<boolean>;
  titleClassName?: string;
  titleActiveColor?: string;
  titleInactiveColor?: string;
  navBottom?: React.ReactNode;
  active?: NumberString;
  duration?: NumberString;
  offsetTop?: NumberString;
  lazyRender?: boolean;
  swipeThreshold?: NumberString;
  onClickTab?: (tab: {
    name: NumberString;
    title: string;
    event: React.MouseEvent;
    disabled: boolean;
  }) => void;
  onChange?: (name: NumberString, title: string) => void;
  onScroll?: (params: { scrollTop: number; isFixed: boolean }) => void;
}

export interface TabsTitleProps extends Props {
  key?: React.Key;
  color?: string;
  title: React.ReactNode;
  badge?: BadgeSettingProps;
  isActive: boolean;
  disabled?: boolean;
  scrollable: boolean;
  activeColor?: string;
  renderTitle?: React.ReactNode | ((active: boolean) => React.ReactNode);
  inactiveColor?: string;
  onClick: (event: React.MouseEvent) => void;
}

export interface TabsContentProps {
  inited?: boolean;
  animated?: boolean;
  canSwipe?: boolean;
  lazyRender?: boolean;
  count: number;
  duration: NumberString;
  currentIndex: number;
  onChange?: (index: number) => void;
}

export interface TabPaneProps {
  key?: React.Key;
  /** @private */
  index?: number;
  name?: NumberString;
  badge?: BadgeSettingProps;
  title?: string;
  titleStyle?: CSSProperties;
  titleClassName?: string;
  disabled?: boolean;
  renderTitle?: React.ReactNode | ((active: boolean) => React.ReactNode);
  children?: React.ReactNode;
}

export type TabsClickTabEventParams = {
  name: NumberString;
  title: string;
  event: React.MouseEvent;
  disabled: boolean;
};

export type TabsInstance = {
  resize: () => void;
};
