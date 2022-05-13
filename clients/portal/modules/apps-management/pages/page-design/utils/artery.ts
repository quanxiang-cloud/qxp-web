import { is, lensPath, set, view } from 'ramda';
import { Node, ReactComponentNode } from '@one-for-all/artery';
import { generateNodeId, buildHTMLNode } from '@one-for-all/artery-engine';

const isString = is(String);

function generateGridChildrenNode(nodeId: string): Node {
  return buildHTMLNode({
    name: 'div',
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
        value: nodeId,
      },
    },
    children: [],
  });
}

function fixGridScale(scale: string): number {
  const scaleResult = +scale >= 12 ? 12 : +scale;
  return scaleResult === 0 ? 1 : scaleResult;
}

export function generateGridChildren(
  node: ReactComponentNode,
  option?: { colRatio?: string },
): Array<Node> {
  const { props, children = [] } = node;
  const { colRatio = '12' } = option ?? props ?? {};
  const scales: string[] = isString(colRatio) ? colRatio.split(':') : [];

  let newChildren: Node[] = [...children];
  const childrenLength = children?.length || 0;
  if (childrenLength > scales.length) {
    newChildren = newChildren.slice(0, scales.length);
  } else if (childrenLength < scales.length) {
    const nodesNumberToAdd = scales.length - childrenLength + 1;
    Array(nodesNumberToAdd).fill(0).forEach(() => {
      const nodeId = generateNodeId('container');
      newChildren.push(generateGridChildrenNode(nodeId));
    });
  }

  return newChildren.map((child, index) => {
    const scale = fixGridScale(scales[index]);
    const styleValuePath = lensPath(['props', 'style', 'value']);
    const newStyleValue = {
      ...view(styleValuePath, child),
      gridArea: `span 1 / span ${scale} / auto / auto`,
    };
    set(styleValuePath, newStyleValue, child);
    return child;
  });
}
