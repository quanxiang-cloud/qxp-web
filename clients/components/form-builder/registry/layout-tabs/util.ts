import { nanoid } from '@c/form-builder/utils';

export function generateRandomTabId(): string {
  return `tab_${nanoid()}`;
}
