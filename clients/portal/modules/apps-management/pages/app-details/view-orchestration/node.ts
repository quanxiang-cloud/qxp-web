import { SchemaNode } from '@one-for-all/schema-utils';

export const NODE: SchemaNode = {
  id: 'root_node',
  label: 'ROOT_LAYOUT',
  type: 'html-element',
  name: 'div',
  props: {
    'data-internal-node': {
      type: 'constant_property',
      value: true,
    },
    'data-layout': {
      type: 'constant_property',
      value: true,
    },
    'data-layout-type': {
      type: 'constant_property',
      value: 'header-content',
    },
  },
  children: [
    {
      id: 'LLed7_-y',
      type: 'html-element',
      name: 'div',
      props: {
        'data-layout-child': {
          type: 'constant_property',
          value: 'fragment-container',
        },
      },
      children: [
        {
          id: 'SryqsMq1',
          type: 'ref-node',
          schemaID: 'app_id:lxzs6:desktop_view_schema:yMNK8jzU',
        },
      ],
    },
    {
      id: '83xESLrM',
      type: 'html-element',
      name: 'div',
      props: {
        'data-layout-child': {
          type: 'constant_property',
          value: 'routes-container',
        },
      },
      children: [
        {
          id: 'DMHvGrHP',
          type: 'route-node',
          path: 'l-DrQDZEhn',
          node: {
            id: 'c5I-uV_i',
            label: '布局1',
            type: 'html-element',
            name: 'div',
            props: {
              'data-internal-node': {
                type: 'constant_property',
                value: true,
              },
              'data-layout': {
                type: 'constant_property',
                value: true,
              },
              'data-layout-type': {
                type: 'constant_property',
                value: 'left-sidebar-content',
              },
            },
            children: [
              {
                id: 'ENQ36E6R',
                type: 'html-element',
                name: 'div',
                props: {
                  'data-layout-child': {
                    type: 'constant_property',
                    value: 'fragment-container',
                  },
                },
                children: [
                  {
                    id: 'k-_gA45f',
                    type: 'ref-node',
                    schemaID: 'app_id:lxzs6:desktop_view_schema:pw2OrBAE',
                  },
                ],
              },
              {
                id: 'U35jigOE',
                type: 'html-element',
                name: 'div',
                props: {
                  'data-layout-child': {
                    type: 'constant_property',
                    value: 'routes-container',
                  },
                },
                children: [
                  {
                    id: 'VXlR0JGM',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'Em9uau_1',
                      type: 'react-component',
                      label: 'hhhhhhhh',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: {
                            tableID: '7fxjb',
                          },
                        },
                        name: {
                          type: 'constant_property',
                          value: 'hhhhhhhh',
                        },
                      },
                    },
                  },
                  {
                    id: 'zRcMwr6U',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'ZfP5R-mE',
                      type: 'react-component',
                      label: 'yyyyy',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: {
                            tableID: 'gz84f',
                          },
                        },
                        name: {
                          type: 'constant_property',
                          value: 'yyyyy',
                        },
                      },
                    },
                  },
                  {
                    id: 'fierbuC4',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'CEvk6UBp',
                      type: 'react-component',
                      label: 'asdfasdf',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'gs8tq',
                        },
                        name: {
                          type: 'constant_property',
                          value: 'asdfasdf',
                        },
                      },
                    },
                  },
                  {
                    id: 'iTAgODY0',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'h7C3k4EG',
                      type: 'react-component',
                      label: '页面1',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'sfmrs',
                        },
                        name: {
                          type: 'constant_property',
                          value: '页面1',
                        },
                      },
                    },
                  },
                  {
                    id: 'GssE--o7',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'DEZKifYo',
                      type: 'react-component',
                      label: '页面2',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'n5pqm',
                        },
                        name: {
                          type: 'constant_property',
                          value: '页面2',
                        },
                      },
                    },
                  },
                  {
                    id: 'YmKJTuoG',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'AgGAc4R2',
                      type: 'react-component',
                      label: '1反反复复发',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'zvgw9',
                        },
                        name: {
                          type: 'constant_property',
                          value: '1反反复复发',
                        },
                      },
                    },
                  },
                  {
                    id: '1ax_vqAd',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'ZI4g65NV',
                      type: 'react-component',
                      label: '页面44',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'wb5qd',
                        },
                        name: {
                          type: 'constant_property',
                          value: '页面44',
                        },
                      },
                    },
                  },
                  {
                    id: 'EbMdUGUY',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'RHSlXBsS',
                      type: 'react-component',
                      label: '页面55',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'pzft6',
                        },
                        name: {
                          type: 'constant_property',
                          value: '页面55',
                        },
                      },
                    },
                  },
                  {
                    id: '9Tx3i6yb',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: '-YN7Ywmh',
                      type: 'react-component',
                      label: '布局66',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'kgwhx',
                        },
                        name: {
                          type: 'constant_property',
                          value: '布局66',
                        },
                      },
                    },
                  },
                  {
                    id: 'Jz1SL39A',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'kLpVoPJK',
                      type: 'react-component',
                      label: '页面66',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'm9j74',
                        },
                        name: {
                          type: 'constant_property',
                          value: '页面66',
                        },
                      },
                    },
                  },
                  {
                    id: 'Al6t0ZxP',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'lVtVZXZB',
                      type: 'react-component',
                      label: '页面777',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'b8jtg',
                        },
                        name: {
                          type: 'constant_property',
                          value: '页面777',
                        },
                      },
                    },
                  },
                  {
                    id: 'DXsOK27j',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'fiZels34',
                      type: 'react-component',
                      label: '页面99',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 's9mdd',
                        },
                        name: {
                          type: 'constant_property',
                          value: '页面99',
                        },
                      },
                    },
                  },
                  {
                    id: '3f9Idl7Y',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'rMldX0wG',
                      type: 'react-component',
                      label: '页面666',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'npt2q',
                        },
                        name: {
                          type: 'constant_property',
                          value: '页面666',
                        },
                      },
                    },
                  },
                  {
                    id: 'PKHg-RyM',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'YUl5J3-i',
                      type: 'react-component',
                      label: '发呆发呆发呆发呆发',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'lx6wx',
                        },
                        name: {
                          type: 'constant_property',
                          value: '发呆发呆发呆发呆发',
                        },
                      },
                    },
                  },
                  {
                    id: '7Nr9QJpJ',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'PUgPIKaV',
                      type: 'react-component',
                      label: '页面888',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'dwrfk',
                        },
                        name: {
                          type: 'constant_property',
                          value: '页面888',
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'Kem4ozhk',
          type: 'route-node',
          path: 'l-Dptp6H1v',
          node: {
            id: 'F6Pn1_g2',
            label: '布局2',
            type: 'html-element',
            name: 'div',
            props: {
              'data-internal-node': {
                type: 'constant_property',
                value: true,
              },
              'data-layout': {
                type: 'constant_property',
                value: true,
              },
              'data-layout-type': {
                type: 'constant_property',
                value: 'right-sidebar-content',
              },
            },
            children: [
              {
                id: 'zgH3xxh8',
                type: 'html-element',
                name: 'div',
                props: {
                  'data-layout-child': {
                    type: 'constant_property',
                    value: 'fragment-container',
                  },
                },
                children: [
                  {
                    id: '47xjl6Wc',
                    type: 'ref-node',
                    schemaID: 'app_id:lxzs6:desktop_view_schema:DcC2_7vy',
                  },
                ],
              },
              {
                id: 'MLvdBOYf',
                type: 'html-element',
                name: 'div',
                props: {
                  'data-layout-child': {
                    type: 'constant_property',
                    value: 'routes-container',
                  },
                },
                children: [
                  {
                    id: 'w2poRR2G',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'ravXb361',
                      type: 'react-component',
                      label: '页面333',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: '6987q',
                        },
                        name: {
                          type: 'constant_property',
                          value: '页面333',
                        },
                      },
                    },
                  },
                  {
                    id: 'FQWfYpwy',
                    type: 'route-node',
                    path: 'p-${genNodeID()}',
                    node: {
                      id: 'YqVqjNon',
                      type: 'react-component',
                      label: '发送地方撒舒服',
                      packageName: 'package_name',
                      packageVersion: '1.0.0',
                      exportName: 'TableSchemaViewRender',
                      props: {
                        tableID: {
                          type: 'constant_property',
                          value: 'gb544',
                        },
                        name: {
                          type: 'constant_property',
                          value: '发送地方撒舒服',
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
};
