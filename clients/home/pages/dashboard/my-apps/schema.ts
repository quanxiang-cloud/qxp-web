import { Schema } from '@one-for-all/schema-spec';

const schema: Schema = {
  apiStateSpec: {
    'my-apps': {
      apiID: 'post:/api/v1/app-center/userList',
    },
  },
  sharedStatesSpec: {},
  node: {
    id: 'app-list',
    type: 'react-component',
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
        type: 'api_result_property',
        stateID: 'my-apps',
        fallback: [],
        convertor: {
          type: 'state_convert_expression',
          expression: 'state.data',
        },
      },
    },
    children: [
      {
        id: 'app-loop-container',
        type: 'loop-container',
        loopKey: 'id',
        iterableState: {
          type: 'api_result_property',
          stateID: 'my-apps',
          fallback: [],
          convertor: {
            type: 'state_convert_expression',
            expression: 'state.data',
          },
        },
        toProps: {
          type: 'to_props_function_spec',
          args: 'state',
          body: 'return { appInfo: state }',
        },
        node: {
          id: 'app-info',
          type: 'react-component',
          packageName: 'demoComponents',
          exportName: 'AppInfoView',
          packageVersion: 'whatever',
          props: {
            className: {
              type: 'constant_property',
              value: 'rounded-12 bg-white user-app-item',
            },
          },
        },
      },
    ],
  },
};

export default schema;
