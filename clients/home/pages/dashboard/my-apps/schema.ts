import { NodePropType, NodeType, Schema } from '@ofa/render-engine';

const schema: Schema = {
  apiStateSpec: {
    'my-apps': {
      apiID: 'post:/api/v1/app-center/userList',
    },
  },
  sharedStatesSpec: {},
  node: {
    id: 'app-list',
    type: NodeType.ReactComponentNode,
    packageName: 'demoComponents',
    exportName: 'MyApps',
    packageVersion: 'whatever',
    lifecycleHooks: {
      didMount: {
        type: 'lifecycle_hook_func_spec',
        args: '',
        body: 'this.apiStates[\'my-apps\'].fetch({ body: { limit: 999, page: 1 }});',
      },
    },
    props: {
      apps: {
        type: NodePropType.APIResultProperty,
        stateID: 'my-apps',
        fallback: [],
        convertor: {
          type: 'state_convert_expression',
          expression: 'state.data.data',
        },
      },
    },
    children: [
      {
        id: 'app-loop-container',
        type: NodeType.LoopContainerNode,
        loopKey: 'id',
        iterableState: {
          type: NodePropType.APIResultProperty,
          stateID: 'my-apps',
          fallback: [],
          convertor: {
            type: 'state_convert_expression',
            expression: 'state.data.data',
          },
        },
        toProps: {
          type: NodePropType.FunctionalProperty,
          func: {
            type: 'raw',
            args: 'v',
            body: 'return { appInfo: v }',
          },
        },
        node: {
          id: 'app-info',
          type: NodeType.ReactComponentNode,
          packageName: 'demoComponents',
          exportName: 'AppInfoView',
          packageVersion: 'whatever',
          props: {
            className: {
              type: NodePropType.ConstantProperty,
              value: 'rounded-12 bg-white user-app-item',
            },
          },
        },
      },
    ],
  },
};

export default schema;
