import React, { useMemo } from 'react';
import { clone, isEmpty } from 'ramda';

import Tree from '@c/headless-tree';
import store$ from '@polyApi/store';
import useObservable from '@lib/hooks/use-observable';
import getPathTreeSource from '@polyApi/utils/get-path-tree-source';
import { addNodeNamePrefix2PolyNodeInput } from '@polyApi/utils/request-node';

import Store from './store';
import NodeRender from './poly-tree-node';

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
  data: [],
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

const AVAILABLE_NODE_TYPE = ['input', 'request'];

type Props = {
  onSelect: (node: any) => void;
}

function FormulaConfigTree({ onSelect }: Props ): JSX.Element {
  const polyNodeStore = useObservable(store$);
  const apiRequestNodeId = polyNodeStore.currentNodeConfigParams?.currentNode?.get('name') as string;
  let sourceNodes: any = [];

  if (polyNodeStore && apiRequestNodeId) {
    sourceNodes = getPathTreeSource(apiRequestNodeId).filter(({ type }) => {
      return AVAILABLE_NODE_TYPE.includes(type || '');
    })?.filter(Boolean).map((field: any) => {
      if (field.type === 'input') {
        return isEmpty(field.data?.detail.inputs) ? undefined : field.data?.detail.inputs;
      }

      return isEmpty(field.data?.detail.outputs) ? undefined : field.data?.detail.outputs;
    }).filter(Boolean);
  }

  const store = useMemo(() => new Store(root, sourceNodes), [root, sourceNodes]);

  return (
    <Tree
      store={store}
      NodeRender={NodeRender}
      RootNodeRender={() => null}
      onSelect={() => onSelect(store.currentFocusedNode)}
    />
  );
}

export default FormulaConfigTree;
