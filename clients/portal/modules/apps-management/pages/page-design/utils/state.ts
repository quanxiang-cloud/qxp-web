import { BlocksCommunicationState } from '@one-for-all/artery-engine';
import { lensPath, set } from 'ramda';

import type { BlocksCommunicationType } from '../types';

export interface UpdateBlocksCommunicationStateParams<T> {
  state: BlocksCommunicationState<BlocksCommunicationType>;
  path: string;
  value: T;
}
export function updateBlocksCommunicationState<T>(params: UpdateBlocksCommunicationStateParams<T>): void {
  const { state, path, value } = params;
  const currentValue = state.getValue();
  const pathesLens = lensPath(path.split('.'));
  const newValue = set(pathesLens, value, currentValue);
  state.next(newValue);
}
