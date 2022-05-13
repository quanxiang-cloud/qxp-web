import { toJS } from 'mobx';
import { generateNodeId } from '@one-for-all/artery-engine';

import { PageNode, PageArtery } from '../types';

export function deepMergeNode(node: PageNode): PageNode {
  const target = toJS(node);
  // support loop-container
  if (target.type === 'loop-container') {
    Object.assign(target, { id: generateNodeId('loop-node') });

    if (target.node) {
      // composed-node
      if (target.node.type === 'composed-node') {
        Object.assign(target.node, { id: generateNodeId('composed-node') });
        if (target.node.outLayer) {
          target.node.outLayer = deepMergeNode(target.node.outLayer);
        }

        if (target.node.children) {
          target.node.children = target.node.children.map(deepMergeNode);
        }

        return target;
      }

      target.node = deepMergeNode(target.node);
    }

    return target;
  }

  Object.assign(target, { id: generateNodeId(node.exportName) });
  if (target.children) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    target.children = target.children.map(deepMergeNode);
  }
  return target;
}

export function generateGridChildren(
  node: Omit<PageNode, 'type'| 'id'>,
  parentId: string,
  conf?: any,
): Omit<PageNode, 'type'| 'id'> {
  const target = node;
  const { defaultConfig, children } = target;
  const { colRatio = '12' } = conf || defaultConfig;
  const scaleArray: string[] = colRatio.split(':');

  const childrenLength = children?.length || 0;
  let newChildren: PageNode[] = [...(children || [])];

  if (childrenLength > scaleArray.length) {
    newChildren = newChildren.slice(0, scaleArray.length);
  }

  if (childrenLength < scaleArray.length) {
    const _array: PageNode[] = [];
    for (let i = 0; i < (scaleArray.length - childrenLength); (i = i + 1)) {
      const elementId = generateNodeId('container');
      _array.push({
        id: elementId,
        pid: parentId,
        type: 'react-component',
        exportName: 'container',
        packageName: '@one-for-all/ui',
        packageVersion: 'latest',
        label: '容器',
        props: {
          style: {
            type: 'constant_property',
            value: {
              display: 'flex',
              flexFlow: 'column nowrap',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              gridArea: 'span 1 / span 1 / auto / auto',
              minWidth: 'auto',
            },
          },
          id: {
            type: 'constant_property',
            value: elementId,
          },
        },
        children: [],
      });
    }

    newChildren = newChildren.concat(_array);
  }

  newChildren = newChildren.map((child, index) => {
    const scale = Number(scaleArray[index]) >= 12 ? 12 : Number(scaleArray[index]);
    child.props.style.value = {
      ...(child.props.style.value || {}),
      gridArea: `span 1 / span ${scale === 0 ? 1 : scale } / auto / auto`,
    };
    return child;
  });

  target.children = newChildren;

  return target;
}

export function initPageArtery(): PageArtery {
  return {
    node: {
      id: generateNodeId('page'),
      pid: '',
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
