import React from 'react';
import { Props } from '@m/qxp-ui-mobile';

export type Direction = 'up' | 'down';

export interface ListProps extends Props {
  error?: boolean;
  loading?: boolean;
  finished?: boolean;
  errorText?: React.ReactNode;
  loadingText?: React.ReactNode;
  finishedText?: React.ReactNode;
  offset?: number | string;
  direction?: Direction;
  immediateCheck?: boolean;
  autoCheck?: boolean;
  onLoad?: () => Promise<unknown> | void;
  children?: React.ReactNode;
}

export type ListInstance = {
  check: () => void;
  state: {
    loading: boolean;
    error: boolean;
  };
};
