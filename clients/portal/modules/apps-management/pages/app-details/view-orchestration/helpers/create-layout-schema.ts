import { Node, RouteNode } from '@one-for-all/artery';
import {
  LAYOUT_CHILD_TYPE_FRAGMENT_CONTAINER,
  LAYOUT_CHILD_TYPE_ROUTES_CONTAINER,
  ROOT_NODE_ID,
} from '../constants';

import { LayoutType } from '../types';
import { genNodeID } from './utils';

export type LayoutSchemaProps = {
  name: string,
  layoutType: LayoutType,
  refSchemaKey: string,
  initialChild?: RouteNode,
  isRoot?: boolean,
}

export default function createLayoutSchema({
  name,
  layoutType,
  refSchemaKey,
  initialChild,
  isRoot,
}: LayoutSchemaProps ): Node {
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
            arteryID: refSchemaKey,
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
        children: initialChild ? [initialChild] : [],
      },
    ],
  };
}
