import { SchemaNode } from '@one-for-all/schema-spec';
import {
  LAYOUT_CHILD_TYPE_FRAGMENT_CONTAINER,
  LAYOUT_CHILD_TYPE_ROUTES_CONTAINER,
  ROOT_NODE_ID,
} from '../constants';

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
        value: true,
      },
      'data-layout': {
        type: 'constant_property',
        value: true,
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
          'data-layout-child': {
            type: 'constant_property',
            value: LAYOUT_CHILD_TYPE_FRAGMENT_CONTAINER,
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
          'data-layout-child': {
            type: 'constant_property',
            value: LAYOUT_CHILD_TYPE_ROUTES_CONTAINER,
          },
        },
        children: [],
      },
    ],
  };
}
