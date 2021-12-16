import { NodePropType, NodeType, Schema } from '@ofa/render-engine';

const schema: Schema = {
  apiStateSpec: {
    querySchema: {
      apiID: 'post:/batchGetValue',
    },
    setSchema: {
      apiID: 'post:/batchSetValue',
    },
  },
  sharedStatesSpec: {},
  node: {
    id: 'container',
    type: NodeType.HTMLNode,
    name: 'div',
    props: {
      style: {
        type: NodePropType.ConstantProperty,
        value: {
          padding: '20px',
          width: '700px',
        },
      },
    },
    children: [
      {
        id: 'toolbar',
        type: NodeType.HTMLNode,
        name: 'div',
        props: {
          style: {
            type: NodePropType.ConstantProperty,
            value: {
              display: 'grid',
              gap: '24px',
              gridTemplateColumns: '1fr 1fr 1fr',
              marginBottom: '24px',
            },
          },
        },
        children: [
          {
            id: 'container-for-key',
            type: NodeType.HTMLNode,
            name: 'span',
            children: [
              {
                id: 'span-schema-key',
                type: NodeType.HTMLNode,
                name: 'span',
                props: {
                  children: {
                    type: NodePropType.ConstantProperty,
                    value: 'Schema Key:',
                  },
                  style: {
                    type: NodePropType.ConstantProperty,
                    value: {
                      marginRight: '8px',
                    },
                  },
                },
              },
              {
                id: 'schema-key-input',
                type: NodeType.HTMLNode,
                name: 'input',
                props: {
                  id: {
                    type: NodePropType.ConstantProperty,
                    value: 'schema-key-input',
                  },
                  style: {
                    type: NodePropType.ConstantProperty,
                    value: {
                      display: 'block',
                    },
                  },
                  value: {
                    type: NodePropType.SharedStateProperty,
                    stateID: 'key',
                    fallback: '',
                  },
                  onChange: {
                    type: NodePropType.FunctionalProperty,
                    func: {
                      type: 'raw',
                      args: 'e',
                      body: 'this.states.key = e.target.value',
                    },
                  },
                },
              },
            ],
          },
          {
            id: 'container-for-version',
            type: NodeType.HTMLNode,
            name: 'span',
            children: [
              {
                id: 'span-schema-version',
                type: NodeType.HTMLNode,
                name: 'span',
                props: {
                  children: {
                    type: NodePropType.ConstantProperty,
                    value: 'Schema Version:',
                  },
                  style: {
                    type: NodePropType.ConstantProperty,
                    value: {
                      marginRight: '8px',
                    },
                  },
                },
              },
              {
                id: 'schema-version-input',
                type: NodeType.HTMLNode,
                name: 'input',
                props: {
                  id: {
                    type: NodePropType.ConstantProperty,
                    value: 'schema-version-input',
                  },
                  style: {
                    type: NodePropType.ConstantProperty,
                    value: {
                      display: 'block',
                    },
                  },
                  value: {
                    type: NodePropType.SharedStateProperty,
                    stateID: 'version',
                    fallback: '',
                  },
                  onChange: {
                    type: NodePropType.FunctionalProperty,
                    func: {
                      type: 'raw',
                      args: 'e',
                      body: 'this.states.version = e.target.value',
                    },
                  },
                },
              },
            ],
          },
          {
            id: 'query-btn-container',
            type: NodeType.HTMLNode,
            name: 'div',
            children: [
              {
                id: 'btn-query',
                type: NodeType.HTMLNode,
                name: 'button',
                props: {
                  className: {
                    type: NodePropType.ConstantProperty,
                    value: 'btn btn--primary',
                  },
                  children: {
                    type: NodePropType.ConstantProperty,
                    value: '查询',
                  },
                  onClick: {
                    type: NodePropType.FunctionalProperty,
                    func: {
                      type: 'raw',
                      args: '',
                      body: `
                      const key = this.states.key;
                      const version = this.states.version;
                      const body = {
                        keys: [{ key, version }],
                      };
                      this.apiStates.querySchema.fetch({ body }, () => {
                        try {
                          const value = this.apiStates.querySchema.result.result[this.states.key];
                          this.states.schema = JSON.stringify(JSON.parse(value), null, 2);
                        } catch (err) {
                          console.log(err)
                        }
                      });
                  `,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        id: 'schema-textarea',
        type: NodeType.HTMLNode,
        name: 'textarea',
        props: {
          style: {
            type: NodePropType.ConstantProperty,
            value: {
              width: '100%',
              height: '400px',
            },
          },
          value: {
            type: NodePropType.SharedStateProperty,
            stateID: 'schema',
            fallback: '',
          },
          onChange: {
            type: NodePropType.FunctionalProperty,
            func: {
              type: 'raw',
              args: 'e',
              body: 'this.states.schema = e.target.value',
            },
          },
        },
      },
      {
        id: 'footer',
        type: NodeType.HTMLNode,
        name: 'div',
        children: [
          {
            id: 'update-btn',
            type: NodeType.HTMLNode,
            name: 'button',
            props: {
              className: {
                type: NodePropType.ConstantProperty,
                value: 'btn btn--primary',
              },
              children: {
                type: NodePropType.ConstantProperty,
                value: '更新',
              },
              onClick: {
                type: NodePropType.FunctionalProperty,
                func: {
                  type: 'raw',
                  args: '',
                  body: `
                  if (!this.states.schema) return;
                  try {
                    const schema = JSON.stringify(JSON.parse(this.states.schema));
                    const key = this.states.key;
                    const version = this.states.version;

                    const body = {
                      params: [{ key, version, value: schema }]
                    };

                    this.apiStates.setSchema.fetch({ body }, ({ error }) => {
                      if (error) {
                        this.states.logs = (this.states.logs || []).concat(new Date().toUTCString() + '更新失败');
                        return;
                      }

                      this.states.logs = (this.states.logs || []).concat(new Date().toUTCString() + '更新成功');
                    });
                  } catch(err) {
                    console.log(err)
                  }
                  `,
                },
              },
            },
          },
          {
            id: 'log-container',
            type: NodeType.HTMLNode,
            name: 'ul',
            children: [
              {
                id: 'logs-loop',
                type: NodeType.LoopContainerNode,
                loopKey: '',
                iterableState: {
                  type: NodePropType.SharedStateProperty,
                  stateID: 'logs',
                  fallback: [],
                  convertor: {
                    type: 'state_convertor_func_spec',
                    args: 'state',
                    body: 'return state.reverse()',
                  },
                },
                toProps: {
                  type: 'to_props_function_spec',
                  args: 'log',
                  body: 'return { children: log }',
                },
                node: {
                  id: 'log-li',
                  type: NodeType.HTMLNode,
                  name: 'li',
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

export default schema;
