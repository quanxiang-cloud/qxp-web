import React, { useMemo } from 'react';
import { clone } from 'ramda';

import Tree from '@c/headless-tree';

import Store from './store';
import NodeRender from './poly-tree-node';
import { addNodeNamePrefix2PolyNodeInput } from '../../utils/request-node';

const startNodeInputs: POLY_API.PolyNodeInput[] = [
  {
    type: 'object',
    name: 'a',
    desc: 'a 是一个对象',
    data: [
      {
        type: 'number',
        name: 'b',
        desc: 'a.b 是一个数字',
        data: [],
        in: 'body',
        required: true,
      },
      {
        type: 'array',
        name: 'c',
        desc: 'a.c 是一个数组',
        data: [
          {
            type: 'string',
            name: '',
            desc: 'a.c.0 是一个字符串',
            data: [],
            in: 'body',
            required: false,
          },
        ],
        in: 'body',
        required: true,
      },
    ],
    in: 'body',
    required: false,
  },
  {
    type: 'string',
    name: 'hello',
    desc: 'hello 是一个字符串',
    data: [],
    in: 'body',
    required: true,
  },
];

const root: POLY_API.PolyNodeInput = {
  type: 'object',
  name: '',
  desc: '',
  data: [{} as POLY_API.PolyNodeInput],
  in: 'body',
  required: false,
};
const child: POLY_API.PolyNodeInput[] = [
  addNodeNamePrefix2PolyNodeInput(clone(startNodeInputs), {
    type: 'object',
    name: 'start',
    desc: 'start node',
    data: [],
    in: 'body',
    required: true,
  }),
  addNodeNamePrefix2PolyNodeInput(clone(startNodeInputs), {
    type: 'object',
    name: 'req1',
    desc: 'request node1',
    data: [],
    in: 'body',
    required: true,
  }),
  addNodeNamePrefix2PolyNodeInput(clone(startNodeInputs), {
    type: 'object',
    name: 'req2',
    desc: 'request node2',
    data: [],
    in: 'body',
    required: true,
  }),
];

function FormulaConfigTree(): JSX.Element {
  const store = useMemo(() => new Store(root, child), [root, child]);

  return (
    <Tree
      store={store}
      NodeRender={NodeRender}
      RootNodeRender={() => null}
    />
  );
}

export default FormulaConfigTree;
