import { buildHTMLNode } from '@one-for-all/artery-engine';
import type { Artery } from '@one-for-all/artery';

export function getArteryKeys(arteryID: string, isDraft: boolean): string[] {
  const draftArteryKey = `${arteryID}:draft`;
  return isDraft ? [draftArteryKey] : [arteryID, draftArteryKey];
}

export function getInitArtery(): Artery {
  return {
    node: buildHTMLNode({
      name: 'div',
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
    }),
    apiStateSpec: {},
    sharedStatesSpec: {},
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

export function isFuncSource(source: string): boolean {
  return typeof source === 'string' && (/function/.test(source) || /\([^)]*\)\s*=>/.test(source));
}
