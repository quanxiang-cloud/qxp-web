import { Artery, Node } from '@one-for-all/artery';
import { ArteryRenderer } from '@one-for-all/artery-renderer';
import React, { useEffect, useState } from 'react';
import { genNodeID } from './modules/apps-management/pages/app-details/view-orchestration/helpers/utils';

import { props_spec } from './props-spec';

const reactNode = {
  id: genNodeID(),
  type: 'react-component',
  packageName: 'ofa-ui',
  packageVersion: 'latest',
  exportName: 'page',
  label: 'react-node',
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
};

const initConfigWrapperNode: Node = {
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
  // children: [{
  //   id: genNodeID(),
  //   type: 'html-element',
  //   name: 'div',
  //   props: {
  //     children: {
  //       type: 'constant_property',
  //       value: '置表单',
  //     },
  //   },
  // }],
};

const initConfigArtery: Artery = {
  node: initConfigWrapperNode,
  apiStateSpec: {},
  sharedStatesSpec: {},
};

function Test(): JSX.Element {
  const [artery, setArtery] = useState(initConfigArtery);

  useEffect(() => {
    const configSpec = props_spec.pop()?.spec;
    const configNodes = configSpec?.map((item) => {
      const labelNode: Node = {
        id: genNodeID(),
        type: 'html-element',
        name: 'div',
        label: item.label,
        props: {
          children: {
            type: 'constant_property',
            value: item.label,
          },
        },
      };
      const itemNode: Node = {
        id: genNodeID(),
        type: 'html-element',
        name: 'div',
        label: item.label,
        props: {
          children: {
            type: 'constant_property',
            value: item.label,
          },
        },
      };

      return labelNode;
    });

    const node: Node = {
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
      children: configNodes,
    };

    setArtery({
      apiStateSpec: {},
      sharedStatesSpec: {},
      node,
    });
  }, []);

  return (
    <ArteryRenderer
      artery={artery}
      // plugins={{ apiSpecAdapter: adapter, repository, componentLoader, refLoader }}
    />
  );
}

export default Test;
