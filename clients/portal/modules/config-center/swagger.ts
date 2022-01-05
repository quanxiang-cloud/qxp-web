import { Spec } from '@ofa/api-spec-adapter/lib/src/swagger-schema-official';

const spec: Spec = {
  swagger: '2.0',
  info: {
    title: 'persona',
    version: 'last',
    description: '个性化配置中心',
  },
  basePath: '/api/v1/persona',
  tags: [
    {
      name: '公共分类',
      description: '公共分类',
    },
  ],
  schemes: [
    'http',
  ],
  paths: {
    '/batchSetValue': {
      post: {
        tags: [
          '公共分类',
        ],
        summary: '批量写入数据',
        description: '',
        consumes: [
          'application/json',
        ],
        parameters: [
          {
            name: 'root',
            in: 'body',
            schema: {
              type: 'object',
              properties: {
                params: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      version: {
                        type: 'string',
                      },
                      key: {
                        type: 'string',
                      },
                      value: {
                        type: 'string',
                      },
                    },
                    required: [
                      'version',
                      'key',
                      'value',
                    ],
                  },
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'number',
                },
                data: {
                  type: 'object',
                  properties: {
                    successKeys: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    failKeys: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/userBatchSetValue': {
      post: {
        tags: [
          '公共分类',
        ],
        summary: '批量存入用户数据',
        description: '',
        consumes: [
          'application/json',
        ],
        parameters: [
          {
            name: 'root',
            in: 'body',
            schema: {
              type: 'object',
              properties: {
                params: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      version: {
                        type: 'string',
                      },
                      key: {
                        type: 'string',
                      },
                      value: {
                        type: 'string',
                      },
                    },
                    required: [
                      'version',
                      'key',
                      'value',
                    ],
                  },
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'number',
                },
                data: {
                  type: 'object',
                  properties: {
                    successKeys: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    failKeys: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/batchGetValue': {
      post: {
        tags: [
          '公共分类',
        ],
        summary: '批量获取数据',
        description: '',
        consumes: [
          'application/json',
        ],
        parameters: [
          {
            name: 'root',
            in: 'body',
            schema: {
              type: 'object',
              properties: {
                keys: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      version: {
                        type: 'string',
                      },
                      key: {
                        type: 'string',
                      },
                    },
                    required: [
                      'version',
                      'key',
                    ],
                  },
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'number',
                },
                data: {
                  type: 'object',
                  properties: {
                    result: {
                      type: 'object',
                      properties: {
                        test1: {
                          type: 'string',
                        },
                        test2: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/userBatchGetValue': {
      post: {
        tags: [
          '公共分类',
        ],
        summary: '批量获取用户数据',
        description: '',
        consumes: [
          'application/json',
        ],
        parameters: [
          {
            name: 'root',
            in: 'body',
            schema: {
              type: 'object',
              properties: {
                keys: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      version: {
                        type: 'string',
                      },
                      key: {
                        type: 'string',
                      },
                    },
                    required: [
                      'version',
                      'key',
                    ],
                  },
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'number',
                },
                data: {
                  type: 'object',
                  properties: {
                    result: {
                      type: 'object',
                      properties: {
                        test1: {
                          type: 'string',
                        },
                        test2: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
export default spec;
