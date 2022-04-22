import { uuid } from '@one-for-all/artery-engine';
import type { Artery, ReactComponentNode } from '@one-for-all/artery';
import { nanoid } from 'nanoid';

import { PAGE_TYPE, INIT_ARTERY_EDITOR_ARTERY } from '../constants';

export function getArteryKeys(arteryID: string, isDraft: boolean): string[] {
  const draftArteryKey = `${arteryID}:draft`;
  return isDraft ? [draftArteryKey] : [arteryID, draftArteryKey];
}

function getInitArtery(): Artery {
  return {
    node: {
      id: uuid(),
      type: 'react-component',
      packageName: '@one-for-all/ui',
      packageVersion: 'latest',
      exportName: 'page',
      label: '页面',
      props: {
        style: {
          type: 'constant_property',
          value: {
            width: '100%',
            height: '100%',
          },
        },
      },
      children: [],
    },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
}

export function getInitArteryByPageType(pageType: string): Artery {
  return pageType === PAGE_TYPE.ARTERY_EDITOR ? INIT_ARTERY_EDITOR_ARTERY : getInitArtery();
}

export function buildNode(id: string, exportName: string, label: string): ReactComponentNode {
  return {
    type: 'react-component',
    id,
    exportName,
    label,
    packageName: '@one-for-all/ui',
    packageVersion: 'latest',
    children: [],
  };
}

export function setHTMLElementAttributes(element: HTMLElement, attributes: Record<string, string>): void {
  Object.keys(attributes).forEach((key) => element.setAttribute(key, attributes[key]));
}

export function openLink(options: Record<string, string>): void {
  const a = document.createElement('a');
  setHTMLElementAttributes(a, options);
  a.click();
}

export function isDev(): boolean {
  return !!window.__isDev__;
}

export function isFuncSource(source: string) {
  return typeof source === 'string' && (/function/.test(source) || /\([^)]*\)\s*=>/.test(source));
}

export function generateNodeId(elemType: string): string {
  const type = elemType.replace(/elem\./, '').toLowerCase();
  return [type, nanoid(8)].join('-');
}
