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
                    this.apiStates.querySchema.fetch({ body });
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
        id: 'readonly-schema-textarea',
        type: NodeType.HTMLNode,
        name: 'textarea',
        props: {
          style: {
            type: NodePropType.ConstantProperty,
            value: {
              width: '100%',
              height: '300px',
            },
          },
          readOnly: {
            type: NodePropType.ConstantProperty,
            value: true,
          },
          value: {
            type: NodePropType.APIResultProperty,
            stateID: 'querySchema',
            fallback: '',
            convertor: {
              type: 'state_convertor_func_spec',
              args: 'state',
              body: `
                try {
                  const schemaStr = state.result[this.states.key];
                  return JSON.stringify(JSON.parse(schemaStr), null, 2);
                } catch (err) {
                  console.error(err);
                }
              `,
            },
          },
        },
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
                  try {
                    const schema = JSON.stringify(JSON.parse(this.states.schema));
                    const key = this.states.key;
                    const version = this.states.version;

                    const body = {
                      params: [{ key, version, value: schema }]
                    };

                    this.apiStates.setSchema.fetch({ body });
                  } catch(err) {
                    console.log(err)
                  }
                  `,
                },
              },
            },
          },
        ],
      },
    ],
  },
};

export default schema;
