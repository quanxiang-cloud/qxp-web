import { cond, equals, always, T } from 'ramda';
import React, { Fragment } from 'react';
import { MiniMap, Background, BackgroundVariant } from 'react-flow-renderer';
import type { Node, BackgroundProps, MiniMapProps } from 'react-flow-renderer';

import Control, { Props as ControlProps } from './render-control';
import { NODE_TYPE_MINIMAP_COLOR_MAP } from './constants';

export interface Props {
  background?: BackgroundProps;
  minimap?: MiniMapProps;
  control?: ControlProps;
}

export default function FlowRenderConfig({ background, minimap, control }: Props): JSX.Element {
  const { variant = BackgroundVariant.Dots, gap = 12, size = 0.5, ...restBackgroundProps } = background ?? {};
  const { nodeColor = defaultNodeColorRender, nodeStrokeWidth = 3, ...restMiniMapProps } = minimap ?? {};

  function defaultNodeColorRender(node: Node): string {
    const switcher = cond([
      [equals('input'), always(NODE_TYPE_MINIMAP_COLOR_MAP['input'])],
      [equals('default'), always(NODE_TYPE_MINIMAP_COLOR_MAP['default'])],
      [equals('output'), always(NODE_TYPE_MINIMAP_COLOR_MAP['output'])],
      [T, always(NODE_TYPE_MINIMAP_COLOR_MAP['noMatch'])],
    ]);

    return switcher(node.type ?? '');
  }

  return (
    <Fragment>
      <Background {...restBackgroundProps} variant={variant} gap={gap} size={size} />
      <MiniMap {...restMiniMapProps} nodeColor={nodeColor} nodeStrokeWidth={nodeStrokeWidth} />
      <Control {...control} />
    </Fragment>
  );
}
