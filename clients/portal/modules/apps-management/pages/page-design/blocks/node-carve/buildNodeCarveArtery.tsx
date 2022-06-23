import { CSSProperties } from 'react';
import { set } from 'lodash';
import { Artery, HTMLNode, Node, NodeProperty, NodeProperties } from '@one-for-all/artery';
import { generateNodeId } from '@one-for-all/artery-engine';
import { BasePropSpec } from '@one-for-all/node-carve';

import versionMap from '../fountainhead/config/name-version-map';

interface OptionsType {
  style?: CSSProperties;
  prefix?: string;
  bindVariable?: boolean;
}

const WILL_COMPONENT_MAP: Record<string, string> = {
  string: 'Input',
  number: 'NumberPicker',
  boolean: 'Switch',
  function: 'FunctionBind',
  object: 'VariableBind',
};

const NOT_IN_PROPS_PANEL_WILL = ['ClassName', 'StyleSheet'];

function convertWillProps(spec: BasePropSpec): NodeProperties {
  const willProps = spec.willProps;
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

function generateNodeProperties(spec: BasePropSpec, options: OptionsType): NodeProperties {
  const willProperties = convertWillProps(spec);
  const defaultProperties = {
    __path: {
      type: 'constant_property',
      value: `${options.prefix}.${spec.name}`,
    },
  };
  return Object.assign({}, defaultProperties, willProperties);
}

function createWrapperNode(style?: CSSProperties, children?: Node[]): HTMLNode {
  const wrapperNode: HTMLNode = {
    id: generateNodeId(),
    type: 'html-element',
    name: 'div',
  };

  if (style) {
    set(wrapperNode, 'props.style', {
      type: 'constant_property',
      value: style,
    });
  }

  if (children && children.length) {
    set(wrapperNode, 'children', children);
  }

  return wrapperNode;
}

function createTextNode(spec: BasePropSpec, options: OptionsType): Node {
  const will = spec.will || WILL_COMPONENT_MAP[spec.type] || 'Unavaliable';
  const labelNode: Node[] = [
    {
      id: generateNodeId(),
      type: 'html-element',
      name: 'label',
      props: {
        children: {
          type: 'constant_property',
          value: spec.label,
        },
      },
    },
  ];

  if (spec.desc) {
    labelNode.push({
      id: generateNodeId(),
      type: 'react-component',
      packageName: 'node-carve',
      packageVersion: versionMap['node-carve'],
      exportName: 'tips',
      props: {
        label: {
          type: 'constant_property',
          value: spec.desc,
        },
      },
    });
  }

  const textNode: Node[] = [createWrapperNode({ display: 'flex' }, labelNode)];
  if (will !== 'Unavaliable' && options.bindVariable) {
    textNode.push({
      id: generateNodeId(),
      type: 'react-component',
      packageName: 'node-carve',
      packageVersion: versionMap['node-carve'],
      exportName: 'statebind',
      props: generateNodeProperties(spec, options),
    });
  }

  return createWrapperNode(options.style, textNode);
}

function createFieldNode(spec: BasePropSpec, options: OptionsType): Node {
  const will = spec.will || WILL_COMPONENT_MAP[spec.type] || 'Unavaliable';
  const children: Node[] = [
    createWrapperNode({ flex: '1' }, [
      {
        id: generateNodeId(),
        type: 'react-component',
        packageName: 'node-carve',
        packageVersion: versionMap['node-carve'],
        exportName: will.toLowerCase(),
        props: generateNodeProperties(spec, options),
      },
    ]),
  ];

  return createWrapperNode(
    {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    children,
  );
}

export function buildNodeCarveArtery(spec: BasePropSpec[], options: OptionsType): Artery {
  const attrSpecNodes = spec
    .filter((s) => s.will ? !NOT_IN_PROPS_PANEL_WILL.includes(s.will) : true)
    .map((spec: BasePropSpec) => {
      const wrapperNode: HTMLNode = {
        id: generateNodeId(),
        type: 'html-element',
        name: 'div',
      };
      const labelNode: Node = createTextNode(spec, {
        ...options,
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 0',
          alignItems: 'center',
        },
      });
      const FieldNode: Node = createFieldNode(spec, options);

      return {
        ...wrapperNode,
        children: [labelNode, FieldNode],
      };
    });

  const rootNode = createWrapperNode({ width: '100%' }, attrSpecNodes);

  return {
    sharedStatesSpec: {},
    apiStateSpec: {},
    node: rootNode,
  };
}

export default buildNodeCarveArtery;
