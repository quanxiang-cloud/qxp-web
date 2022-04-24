import React, { useEffect, useState } from 'react';
import { Artery, HTMLNode, Node } from '@one-for-all/artery';
import { ArteryRenderer } from '@one-for-all/artery-renderer';

import Toggle from '@c/toggle';
import { genNodeID } from './modules/apps-management/pages/app-details/view-orchestration/helpers/utils';

import { Props_Spec, props_spec } from './props-spec';

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
  return {
    id: genNodeID(),
    type: 'react-component',
    packageName: 'node-carve',
    packageVersion: '1.0.0',
    exportName: item.will || WILL_COMPONENT_MAP[item.type],
    label: item.label,
    props: {
      path: {
        type: 'constant_property',
        value: `${item.name}`,
      },
      initValue: {
        type: 'constant_property',
        value: `${item.initialValue}`,
      },
    },
  };
}

const repository = {
  'node-carve@1.0.0': {
    Toggle,
  },
};

function Test(): JSX.Element {
  const [artery, setArtery] = useState(initConfigArtery);

  useEffect(() => {
    const configSpec = props_spec.pop()?.spec;
    const configNodes = configSpec?.map((item: Props_Spec) => {
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
        const descNode: Node = buildTextItem(item, { paddingTop: '8px', color: '#94A3B8', fontSize: '12px' });

        return {
          ...wrapperNode,
          children: [
            ...nodes,
            descNode,
          ],
        };
      }

      return {
        ...wrapperNode,
        children: nodes,
      };
    });

    const node: HTMLNode = {
      ...configWrapperNode,
      children: configNodes,
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
