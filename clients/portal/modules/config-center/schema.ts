import { Schema } from '@one-for-all/schema-spec';

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
    type: 'html-element',
    name: 'div',
    props: {
      style: {
        type: 'constant_property',
        value: {
          padding: '20px',
          width: '700px',
        },
      },
    },
    children: [
      {
        id: 'toolbar',
        type: 'html-element',
        name: 'div',
        props: {
          style: {
            type: 'constant_property',
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
            type: 'html-element',
            name: 'span',
            children: [
              {
                id: 'span-schema-key',
                type: 'html-element',
                name: 'span',
                props: {
                  children: {
                    type: 'constant_property',
                    value: 'Schema Key:',
                  },
                  style: {
                    type: 'constant_property',
                    value: {
                      marginRight: '8px',
                    },
                  },
                },
              },
              {
                id: 'schema-key-input',
                type: 'html-element',
                name: 'input',
                props: {
                  id: {
                    type: 'constant_property',
                    value: 'schema-key-input',
                  },
                  style: {
                    type: 'constant_property',
                    value: {
                      display: 'block',
                    },
                  },
                  value: {
                    type: 'shared_state_property',
                    stateID: 'key',
                    fallback: '',
                  },
                  onChange: {
                    type: 'functional_property',
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
            type: 'html-element',
            name: 'span',
            children: [
              {
                id: 'span-schema-version',
                type: 'html-element',
                name: 'span',
                props: {
                  children: {
                    type: 'constant_property',
                    value: 'Schema Version:',
                  },
                  style: {
                    type: 'constant_property',
                    value: {
                      marginRight: '8px',
                    },
                  },
                },
              },
              {
                id: 'schema-version-input',
                type: 'html-element',
                name: 'input',
                props: {
                  id: {
                    type: 'constant_property',
                    value: 'schema-version-input',
                  },
                  style: {
                    type: 'constant_property',
                    value: {
                      display: 'block',
                    },
                  },
                  value: {
                    type: 'shared_state_property',
                    stateID: 'version',
                    fallback: '',
                  },
                  onChange: {
                    type: 'functional_property',
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
            type: 'html-element',
            name: 'div',
            children: [
              {
                id: 'btn-query',
                type: 'html-element',
                name: 'button',
                props: {
                  className: {
                    type: 'constant_property',
                    value: 'btn btn--primary',
                  },
                  children: {
                    type: 'constant_property',
                    value: '查询',
                  },
                  onClick: {
                    type: 'functional_property',
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
        type: 'html-element',
        name: 'textarea',
        props: {
          style: {
            type: 'constant_property',
            value: {
              width: '100%',
              height: '400px',
            },
          },
          value: {
            type: 'shared_state_property',
            stateID: 'schema',
            fallback: '',
          },
          onChange: {
            type: 'functional_property',
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
        type: 'html-element',
        name: 'div',
        children: [
          {
            id: 'update-btn',
            type: 'html-element',
            name: 'button',
            props: {
              className: {
                type: 'constant_property',
                value: 'btn btn--primary',
              },
              children: {
                type: 'constant_property',
                value: '更新',
              },
              onClick: {
                type: 'functional_property',
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
            type: 'html-element',
            name: 'ul',
            children: [
              {
                id: 'logs-loop',
                type: 'loop-container',
                loopKey: '',
                iterableState: {
                  type: 'shared_state_property',
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
                  args: 'state',
                  body: 'return { children: state }',
                },
                node: {
                  id: 'log-li',
                  type: 'html-element',
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
