import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { mergeLeft } from 'ramda';
import { SmartEdgeProvider, SmartEdgeOptions } from '@tisoap/react-flow-smart-edge';

import { SMART_EDGE_CONFIG } from './constants';

import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';

import Layout, { Props as LayoutProps } from './render-layout';

interface Props extends LayoutProps {
  smartEdgeOptions?: SmartEdgeOptions;
}

export default function FlowRender({ smartEdgeOptions, ...props }: Props): JSX.Element {
  return (
    <ReactFlowProvider>
      <SmartEdgeProvider options={mergeLeft(smartEdgeOptions ?? {}, SMART_EDGE_CONFIG)}>
        <Layout {...props} />
      </SmartEdgeProvider>
    </ReactFlowProvider>
  );
}
