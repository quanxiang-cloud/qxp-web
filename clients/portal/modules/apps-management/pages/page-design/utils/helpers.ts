import React from 'react';
import { defaults, get, identity } from 'lodash';

import { LoopNode, PageNode } from '../types';
import { mapRawProps } from './artery-adapter';
import registry from '../stores/registry';
import page from '../stores/page';
import { PagePlaceholder, ContainerPlaceholder } from './common-comps';
import { isDev } from '../utils';
import { encode } from '../utils/base64';

export function transformType(artery: PageNode | LoopNode): string | React.ComponentType {
  const { type } = artery;
  if (type === 'react-component') {
    return registry.elementMap?.[artery.exportName]?.component || type;
  }
  if (type === 'loop-container') {
    const nodeType = get(artery, 'node.exportName');
    return registry.elementMap[nodeType]?.component;
  }
  if (type === 'html-element') {
    return artery.name || 'div';
  }
  return 'div';
}

export function mergeProps(artery: PageNode): Record<string, any> {
  const elemConf = registry.getElemByType(artery.exportName) || {};
  const toProps = elemConf?.toProps || identity;
  const elemProps = defaults({}, mapRawProps(artery.props || {}), elemConf?.defaultConfig);

  // patch certain elem props
  if (artery.type === 'react-component') {
    // add placeholder to page elem
    if (artery.exportName === 'page' && !artery.children?.length) {
      Object.assign(elemProps, { placeholder: React.createElement(PagePlaceholder) });
    }
    // add placeholder to container elem
    if (artery.exportName === 'container' && !artery.children?.length) {
      Object.assign(elemProps, { placeholder: React.createElement(ContainerPlaceholder) });
    }
  }

  return toProps(elemProps);
}

export function loadDevEnvPageArtery() {
  if (isDev()) {
    let storedArtery = localStorage.getItem('page_artery');
    try {
      storedArtery = JSON.parse(storedArtery as any);
    } catch (err) {
      storedArtery = null;
    }
    storedArtery && page.setSchema(storedArtery as any);
  }
}

export function svgPreviewImg(title: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='20'>
    <rect width='100' height='20' fill='#888' opacity='0.5'></rect>
    <text x='10' y='15' style='font-family: Roboto, sans-serif;font-size: 12px; fill: #000; text-align: center'>${title}</text>
    </svg>`;

  return `data:image/svg+xml;base64,${encode(svg)}`;
}

export function isSystemComponent(category: string): boolean {
  return category === 'systemComponents';
}
