import React, { useEffect, useState } from 'react';
import { Artery, HTMLNode, Node, NodeProperty, NodeProperties } from '@one-for-all/artery';
import { ArteryRenderer } from '@one-for-all/artery-renderer';

import Toggle from '@c/toggle';
import { genNodeID } from './modules/apps-management/pages/app-details/view-orchestration/helpers/utils';

import { Props_Spec, props_spec } from './props-spec';

const repository = {
  'node-carve@1.0.0': {
    Toggle,
  },
};

const configWrapperNode: HTMLNode = {
  id: genNodeID(),
  type: 'html-element',
  name: 'div',
  label: '属性配置',
  props: {
    style: {
      type: 'constant_property',
      value: {
        width: '100%',
        height: '100vh',
      },
    },
  },
};

const initConfigArtery: Artery = {
  node: configWrapperNode,
  apiStateSpec: {},
  sharedStatesSpec: {},
};

const WILL_COMPONENT_MAP: Record<string, string> = {
  string: 'Input',
  number: 'NumberPicker',
  boolean: 'Toggle',
};

function convertorWillProps(item: Props_Spec): NodeProperties {
  const willProps = item.willProps;
  if (!willProps) {
    return {};
  }

  const propsMap = Object.entries(willProps).map(([key, value]: [string, any]): [string, NodeProperty] => {
    let _value: NodeProperty = {} as NodeProperty;
    if (!value?.type) {
      _value = { type: 'constant_property', value: value };
    }

    return [key, _value];
  });

  const nodeProperties: NodeProperties = propsMap.reduce((acc: NodeProperties, [key, value]) => {
    acc[key] = value;

    return acc;
  }, {} as NodeProperties);

  return nodeProperties;
}

function buildTextItem(item: Props_Spec, style?: Record<string, string>): Node {
  return {
    id: genNodeID(),
    type: 'html-element',
    name: 'div',
    label: item.label,
    props: {
      children: {
        type: 'constant_property',
        value: item.label,
      },
      style: {
        type: 'constant_property',
        value: style,
      },
    },
  };
}

function buildFieldItem(item: Props_Spec): Node {
  const defaultProperties = {
    path: {
      type: 'constant_property',
      value: `${item.name}`,
    },
    initValue: {
      type: 'constant_property',
      value: item.initialValue,
    },
  };
  const willProperties = convertorWillProps(item);

  return {
    id: genNodeID(),
    type: 'react-component',
    packageName: 'node-carve',
    packageVersion: '1.0.0',
    exportName: item.will || WILL_COMPONENT_MAP[item.type],
    label: item.label,
    props: Object.assign(defaultProperties, willProperties),
  };
}

function buildConfigNodes(): HTMLNode[] | undefined {
  return props_spec.pop()?.spec?.map((item: Props_Spec) => {
    const wrapperNode: HTMLNode = {
      id: genNodeID(),
      type: 'html-element',
      name: 'div',
      label: item.label,
    };
    const labelNode: Node = buildTextItem(item, { padding: '8px 0' });
    const itemNode: Node = buildFieldItem(item);
    const nodes: Node[] = [labelNode, itemNode];

    if (item.desc) {
      nodes.push(buildTextItem(item, { paddingTop: '8px', color: '#94A3B8', fontSize: '12px' }));
    }

    return {
      ...wrapperNode,
      children: nodes,
    };
  });
}

function Test(): JSX.Element {
  const [artery, setArtery] = useState(initConfigArtery);

  useEffect(() => {
    const node: HTMLNode = {
      ...configWrapperNode,
      children: buildConfigNodes(),
    };

    setArtery({
      apiStateSpec: {},
      sharedStatesSpec: {},
      node,
    });
  }, []);

  useEffect(() => {
    console.log(artery);
  }, [artery]);

  return (
    <ArteryRenderer
      artery={artery}
      plugins={{ repository }}
    />
  );
}

export default Test;
