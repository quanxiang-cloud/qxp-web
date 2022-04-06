import { uuid } from '@one-for-all/page-engine-v2';
import type { Schema, ReactComponentNode } from '@one-for-all/schema-spec';
import { nanoid } from 'nanoid';

import { PAGE_TYPE, INIT_SCHEMA_EDITOR_SCHEMA } from '../constants';

export function getSchemaKey(appID: string, schemaID: string, isDraft: boolean): string {
  return isDraft ? `${schemaID}:draft` : schemaID;
}

function getInitSchema(): Schema {
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

export function getInitSchemaByPageType(pageType: string): Schema {
  return pageType === PAGE_TYPE.SCHEMA_EDITOR ? INIT_SCHEMA_EDITOR_SCHEMA : getInitSchema();
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

// extend json.stringify/parser to serialize and deserialize vdom
export function serialize(schema: any) {
  return JSON.stringify(schema, function(key, val) {
    if (typeof val === 'function') {
      return val.toString();
    }
    return val;
  }, 2);
}

export function isFuncSource(source: string) {
  return typeof source === 'string' && (/function/.test(source) || /\([^)]*\)\s*=>/.test(source));
}

export function elemId(elemType: string): string {
  const type = elemType.replace(/elem\./, '').toLowerCase();
  return [type, nanoid(8)].join('-');
}
