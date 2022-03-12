import { SchemaNode } from '@one-for-all/schema-spec';
import { ROOT_NODE_ID } from '../constants';

import { LayoutType } from '../types';
import { genNodeID } from './utils';

export default function createLayoutSchema(
  name: string,
  layoutType: LayoutType,
  refSchemaKey: string,
  isRoot?: boolean,
): SchemaNode {
  return {
    id: isRoot ? ROOT_NODE_ID : genNodeID(),
    label: name,
    type: 'html-element',
    name: 'div',
    props: {
      'data-internal-node': {
        type: 'constant_property',
        value: 'true',
      },
      'data-layout': {
        type: 'constant_property',
        value: 'true',
      },
      'data-layout-type': {
        type: 'constant_property',
        value: layoutType,
      },
    },
    children: [
      {
        id: genNodeID(),
        type: 'html-element',
        name: 'div',
        props: {
          'data-layout-element': {
            type: 'constant_property',
            value: 'fragment-container',
          },
        },
        children: [
          {
            id: genNodeID(),
            type: 'ref-node',
            schemaID: refSchemaKey,
          },
        ],
      },
      {
        id: genNodeID(),
        type: 'html-element',
        name: 'div',
        props: {
          'data-layout-element': {
            type: 'constant_property',
            value: 'routes-container',
          },
        },
        children: [],
      },
    ],
  };
}
