import { APIType } from './types';

import { store } from './index';
import { http } from './utils';

describe('api store', () => {
  const appID = 'sm2nv';
  const firstDirectoryName = 'k76sd';
  const firstDirectory = {
    id: 'ns__Lt63wj_SbiQJrcAD-AD1w',
    owner: 'system',
    ownerName: '',
    parent: '/system/app/sm2nv/raw/inner/form',
    name: firstDirectoryName,
    subCount: 0,
    title: '示例页面',
    desc: '示例页面',
    active: 1,
    createAt: 1648625726605,
    updateAt: 1648625726605,
    children: null,
    type: 'inner.form',
  };
  const firstAPI = {
    id: 'raw_AClJqZqwRMX0umuJkLoWGva52c3laG-B3Jpy6bDRNBHC',
    owner: 'system',
    ownerName: '',
    name: `${firstDirectoryName}_update.r`,
    title: '示例页面(更新)',
    desc: '',
    fullPath: `/system/app/${appID}/raw/inner/form/${firstDirectoryName}/${
      firstDirectoryName
    }_update.r`,
    url: `http://form/api/v1/form/${appID}/home/form/${firstDirectoryName}/update`,
    version: 'last',
    method: 'POST',
    action: '',
    active: 1,
    valid: 1,
    createAt: 1648625726650,
    updateAt: 1648625846705,
    type: APIType.INNER_FORM,
  };
  const apiTypes = [APIType.INNER_FORM];

  beforeEach(() => {
    store.reset();
    store.setAppID(appID);
    http.post = async (url: string): Promise<string> => {
      if (url === '/api/v1/polyapi/namespace/appPath') {
        return JSON.stringify({
          code: 0,
          data: {
            appID: appID,
            pathType: 'raw.inner',
            appPath: `/system/app/${appID}/raw/inner`,
          },
        });
      } else if (url === `/api/v1/polyapi/namespace/tree/system/app/${appID}/raw/inner`) {
        return JSON.stringify({
          code: 0,
          data: {
            root: {
              id: '',
              owner: '',
              ownerName: '',
              parent: `/system/app/${appID}/raw`,
              name: 'inner',
              subCount: 0,
              title: '',
              desc: '',
              active: 0,
              createAt: 0,
              updateAt: 0,
              children: [
                {
                  id: 'ns_G4tGaodERlSy-FB_qJ4C4g',
                  owner: 'system',
                  ownerName: '',
                  parent: `/system/app/${appID}/raw/inner`,
                  name: 'form',
                  subCount: 1,
                  title: '表单模型API',
                  desc: '',
                  active: 1,
                  createAt: 1648620941927,
                  updateAt: 1648620941927,
                  children: [
                    {
                      id: 'ns__Lt63wj_SbiQJrcAD-AD1w',
                      owner: 'system',
                      ownerName: '',
                      parent: `/system/app/${appID}/raw/inner/form`,
                      name: firstDirectoryName,
                      subCount: 0,
                      title: '示例页面',
                      desc: '示例页面',
                      active: 1,
                      createAt: 1648625726605,
                      updateAt: 1648625726605,
                      children: null,
                    },
                  ],
                },
              ],
            },
          },
        });
      } else if (
        url === `/api/v1/polyapi/raw/list/system/app/${appID}/raw/inner/form/${firstDirectoryName}`
      ) {
        return JSON.stringify({
          code: 0,
          data: {
            total: -1,
            page: 0,
            list: [
              {
                id: 'raw_AC7SYbDTsKqsSlfAyVuhM-KHWCDtEbIwfYRvwAxGPJLl',
                owner: 'system',
                ownerName: '',
                name: `${firstDirectoryName}_create.r`,
                title: '示例页面(新增)',
                desc: '',
                fullPath: `/system/app/${appID}/raw/inner/form/${firstDirectoryName}/${
                  firstDirectoryName
                }_create.r`,
                url: `http://form/api/v1/form/${appID}/home/form/${firstDirectoryName}/create`,
                version: 'last',
                method: 'POST',
                action: '',
                active: 1,
                valid: 1,
                createAt: 1648625726619,
                updateAt: 1648625846711,
              },
              {
                id: 'raw_AL4L-XH4xnl_HSDyLuPpymKtt3Mn3r627DKRktXhdpeM',
                owner: 'system',
                ownerName: '',
                name: `${firstDirectoryName}_delete.r`,
                title: '示例页面(删除) ',
                desc: '',
                fullPath: `/system/app/${appID}/raw/inner/form/${firstDirectoryName}/${
                  firstDirectoryName
                }_delete.r`,
                url: `http://form/api/v1/form/${appID}/home/form/${firstDirectoryName}/delete`,
                version: 'last',
                method: 'POST',
                action: '',
                active: 1,
                valid: 1,
                createAt: 1648625726627,
                updateAt: 1648625846719,
              },
              {
                id: 'raw_AJd6ecBz5qLlOnWHsrqX70oXTo8S1-XjDlUcpUGjNWee',
                owner: 'system',
                ownerName: '',
                name: `${firstDirectoryName}_get.r`,
                title: '示例页面(查询单条)',
                desc: '',
                fullPath: `/system/app/${appID}/raw/inner/form/${firstDirectoryName}/${
                  firstDirectoryName
                }_get.r`,
                url: `http://form/api/v1/form/${appID}/home/form/${firstDirectoryName}/get`,
                version: 'last',
                method: 'POST',
                action: '',
                active: 1,
                valid: 1,
                createAt: 1648625726643,
                updateAt: 1648625846734,
              },
              {
                id: 'raw_ALtOQ4VLkT9qw7krENcKsP4gNsuO4uPAq6-Gs7ZKOWBp',
                owner: 'system',
                ownerName: '',
                name: `${firstDirectoryName}_search.r`,
                title: '示例页面(查询多条)',
                desc: '',
                fullPath: `/system/app/${appID}/raw/inner/form/${firstDirectoryName}/${
                  firstDirectoryName
                }_search.r`,
                url: `http://form/api/v1/form/${appID}/home/form/${firstDirectoryName}/search`,
                version: 'last',
                method: 'POST',
                action: '',
                active: 1,
                valid: 1,
                createAt: 1648625726635,
                updateAt: 1648625846726,
              },
              firstAPI,
            ],
          },
        });
      } else if (url === '/api/v1/polyapi/raw/list/system/app/sm2nv/raw/inner') {
        return JSON.stringify({
          code: 0,
          data: {
            total: -1,
            page: 0,
            list: [],
          },
        });
      } else if (url === '/api/v1/polyapi/raw/list/system/app/sm2nv/raw/inner/form') {
        return JSON.stringify({
          code: 0,
          data: {
            total: -1,
            page: 0,
            list: [],
          },
        });
      } else if (url === `/api/v1/polyapi/doc${firstAPI.fullPath}`) {
        return JSON.stringify({
          code: 0,
          data: {
            title: '示例页面(更新)',
            apiPath: '/system/app/sm2nv/raw/inner/form/k76sd/k76sd_update.r',
            docType: 'raw',
            doc: {
              url: 'http://keeper.test/api/v1/polyapi/request/system/app/sm2nv/raw/inner/form/k76sd/k76sd_update.r',
              method: 'POST',
              desc: '',
              input: {
                inputs: [
                  {
                    type: 'string',
                    name: 'X-Polysign-Access-Key-Id',
                    title: '签名密钥序号',
                    desc: 'access_key_id dispatched by poly api server',
                    $appendix$: true,
                    data: 'KeiIY8098435rty',
                    in: 'header',
                    mock: 'KeiIY8098435rty',
                  },
                  {
                    type: 'string',
                    name: 'X-Polysign-Timestamp',
                    title: '签名时间戳',
                    desc: 'timestamp format ISO8601: 2006-01-02T15:04:05-0700',
                    $appendix$: true,
                    data: '2020-12-31T12:34:56+0800',
                    in: 'header',
                    mock: '2020-12-31T12:34:56+0800',
                  },
                  {
                    type: 'string',
                    name: 'X-Polysign-Version',
                    title: '签名版本',
                    desc: '"1" only current',
                    $appendix$: true,
                    data: '1',
                    in: 'header',
                    mock: '1',
                  },
                  {
                    type: 'string',
                    name: 'X-Polysign-Method',
                    title: '签名方法',
                    desc: '"HmacSHA256" only current',
                    $appendix$: true,
                    data: 'HmacSHA256',
                    in: 'header',
                    mock: 'HmacSHA256',
                  },
                  {
                    type: 'string',
                    name: 'Access-Token',
                    title: '登录授权码',
                    desc: 'Access-Token from oauth2 if use token access mode',
                    $appendix$: true,
                    data: null,
                    in: 'header',
                    mock: 'H3K56789lHIUkjfkslds',
                  },
                  {
                    type: 'object',
                    name: 'root',
                    desc: 'body inputs',
                    data: [
                      {
                        type: 'object',
                        name: 'entity',
                        desc: 'entity',
                        data: [
                          {
                            type: 'string',
                            name: 'field_XPzC63rz',
                            title: '单行文本',
                            data: null,
                          },
                        ],
                      },
                      {
                        type: 'object',
                        name: 'query',
                        data: [
                          {
                            type: 'object',
                            name: 'term',
                            data: [
                              {
                                type: 'string',
                                name: '_id',
                                data: null,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        type: 'string',
                        name: 'x_polyapi_signature',
                        title: '参数签名',
                        desc: 'required if Access-Token doesn\'t use.\nHmacSHA256 signature of input body: sort query gonic asc|sha256 <SECRET_KEY>|base64 std encode',
                        $appendix$: true,
                        data: 'EJML8aQ3BkbciPwMYHlffv2BagW0kdoI3L_qOedQylw',
                      },
                    ],
                    in: 'body',
                  },
                ],
              },
              output: {
                body: {
                  type: '',
                  name: '',
                  data: null,
                },
                doc: [
                  {
                    type: 'object',
                    data: [
                      {
                        type: 'number',
                        name: 'code',
                        title: '状态码',
                        data: null,
                      },
                      {
                        type: 'object',
                        name: 'data',
                        data: [
                          {
                            type: 'string',
                            name: 'updated_at',
                            title: '修改时间',
                            data: null,
                          },
                          {
                            type: 'string',
                            name: '_id',
                            title: 'id',
                            data: null,
                          },
                          {
                            type: 'string',
                            name: 'created_at',
                            title: '创建时间',
                            data: null,
                          },
                          {
                            type: 'string',
                            name: 'creator_id',
                            title: '创建者 ID',
                            data: null,
                          },
                          {
                            type: 'string',
                            name: 'creator_name',
                            title: '创建者',
                            data: null,
                          },
                          {
                            type: 'string',
                            name: 'field_XPzC63rz',
                            title: '单行文本',
                            data: null,
                          },
                          {
                            type: 'string',
                            name: 'modifier_id',
                            title: '修改者 ID',
                            data: null,
                          },
                          {
                            type: 'string',
                            name: 'modifier_name',
                            title: '修改者',
                            data: null,
                          },
                        ],
                      },
                      {
                        type: 'string',
                        name: 'msg',
                        title: '错误信息',
                        data: null,
                      },
                    ],
                    in: 'body',
                  },
                ],
              },
            },
          },
        });
      }
      return '';
    };
  });

  it('should get all inner form directory', async (): Promise<void> => {
    await store.setApiTypes(apiTypes);
    const expectedResult = [
      {
        type: 'inner.form',
        rootDirectory: {
          id: '',
          owner: '',
          ownerName: '',
          parent: '/system/app/sm2nv/raw',
          name: 'inner',
          subCount: 0,
          title: '',
          desc: '',
          active: 0,
          createAt: 0,
          updateAt: 0,
          children: [
            {
              id: 'ns_G4tGaodERlSy-FB_qJ4C4g',
              owner: 'system',
              ownerName: '',
              parent: '/system/app/sm2nv/raw/inner',
              name: 'form',
              subCount: 1,
              title: '表单模型API',
              desc: '',
              active: 1,
              createAt: 1648620941927,
              updateAt: 1648620941927,
              children: [
                {
                  id: 'ns__Lt63wj_SbiQJrcAD-AD1w',
                  owner: 'system',
                  ownerName: '',
                  parent: '/system/app/sm2nv/raw/inner/form',
                  name: 'k76sd',
                  subCount: 0,
                  title: '示例页面',
                  desc: '示例页面',
                  active: 1,
                  createAt: 1648625726605,
                  updateAt: 1648625726605,
                  children: null,
                  type: 'inner.form',
                },
              ],
              type: 'inner.form',
            },
          ],
          type: 'inner.form',
        },
        apiListMap: {
          '/system/app/sm2nv/raw/inner': [],
          '/system/app/sm2nv/raw/inner/form/k76sd': [
            {
              id: 'raw_AC7SYbDTsKqsSlfAyVuhM-KHWCDtEbIwfYRvwAxGPJLl',
              owner: 'system',
              ownerName: '',
              name: 'k76sd_create.r',
              title: '示例页面(新增)',
              desc: '',
              fullPath: '/system/app/sm2nv/raw/inner/form/k76sd/k76sd_create.r',
              url: 'http://form/api/v1/form/sm2nv/home/form/k76sd/create',
              version: 'last',
              method: 'POST',
              action: '',
              active: 1,
              valid: 1,
              createAt: 1648625726619,
              updateAt: 1648625846711,
              type: 'inner.form',
            },
            {
              id: 'raw_AL4L-XH4xnl_HSDyLuPpymKtt3Mn3r627DKRktXhdpeM',
              owner: 'system',
              ownerName: '',
              name: 'k76sd_delete.r',
              title: '示例页面(删除) ',
              desc: '',
              fullPath: '/system/app/sm2nv/raw/inner/form/k76sd/k76sd_delete.r',
              url: 'http://form/api/v1/form/sm2nv/home/form/k76sd/delete',
              version: 'last',
              method: 'POST',
              action: '',
              active: 1,
              valid: 1,
              createAt: 1648625726627,
              updateAt: 1648625846719,
              type: 'inner.form',
            },
            {
              id: 'raw_AJd6ecBz5qLlOnWHsrqX70oXTo8S1-XjDlUcpUGjNWee',
              owner: 'system',
              ownerName: '',
              name: 'k76sd_get.r',
              title: '示例页面(查询单条)',
              desc: '',
              fullPath: '/system/app/sm2nv/raw/inner/form/k76sd/k76sd_get.r',
              url: 'http://form/api/v1/form/sm2nv/home/form/k76sd/get',
              version: 'last',
              method: 'POST',
              action: '',
              active: 1,
              valid: 1,
              createAt: 1648625726643,
              updateAt: 1648625846734,
              type: 'inner.form',
            },
            {
              id: 'raw_ALtOQ4VLkT9qw7krENcKsP4gNsuO4uPAq6-Gs7ZKOWBp',
              owner: 'system',
              ownerName: '',
              name: 'k76sd_search.r',
              title: '示例页面(查询多条)',
              desc: '',
              fullPath: '/system/app/sm2nv/raw/inner/form/k76sd/k76sd_search.r',
              url: 'http://form/api/v1/form/sm2nv/home/form/k76sd/search',
              version: 'last',
              method: 'POST',
              action: '',
              active: 1,
              valid: 1,
              createAt: 1648625726635,
              updateAt: 1648625846726,
              type: 'inner.form',
            },
            {
              id: 'raw_AClJqZqwRMX0umuJkLoWGva52c3laG-B3Jpy6bDRNBHC',
              owner: 'system',
              ownerName: '',
              name: 'k76sd_update.r',
              title: '示例页面(更新)',
              desc: '',
              fullPath: '/system/app/sm2nv/raw/inner/form/k76sd/k76sd_update.r',
              url: 'http://form/api/v1/form/sm2nv/home/form/k76sd/update',
              version: 'last',
              method: 'POST',
              action: '',
              active: 1,
              valid: 1,
              createAt: 1648625726650,
              updateAt: 1648625846705,
              type: 'inner.form',
            },
          ],
        },
        apiDocMap: {
          '/system/app/sm2nv/raw/inner/form/k76sd/k76sd_update.r': {
            code: 0,
            data: {
              title: '示例页面(更新)',
              apiPath: '/system/app/sm2nv/raw/inner/form/k76sd/k76sd_update.r',
              docType: 'raw',
              doc: {
                url: 'http://keeper.test/api/v1/polyapi/request/system/app/sm2nv/raw/inner/form/k76sd/k76sd_update.r',
                method: 'POST',
                desc: '',
                input: {
                  inputs: [
                    {
                      type: 'string',
                      name: 'X-Polysign-Access-Key-Id',
                      title: '签名密钥序号',
                      desc: 'access_key_id dispatched by poly api server',
                      $appendix$: true,
                      data: 'KeiIY8098435rty',
                      in: 'header',
                      mock: 'KeiIY8098435rty',
                    },
                    {
                      type: 'string',
                      name: 'X-Polysign-Timestamp',
                      title: '签名时间戳',
                      desc: 'timestamp format ISO8601: 2006-01-02T15:04:05-0700',
                      $appendix$: true,
                      data: '2020-12-31T12:34:56+0800',
                      in: 'header',
                      mock: '2020-12-31T12:34:56+0800',
                    },
                    {
                      type: 'string',
                      name: 'X-Polysign-Version',
                      title: '签名版本',
                      desc: '"1" only current',
                      $appendix$: true,
                      data: '1',
                      in: 'header',
                      mock: '1',
                    },
                    {
                      type: 'string',
                      name: 'X-Polysign-Method',
                      title: '签名方法',
                      desc: '"HmacSHA256" only current',
                      $appendix$: true,
                      data: 'HmacSHA256',
                      in: 'header',
                      mock: 'HmacSHA256',
                    },
                    {
                      type: 'string',
                      name: 'Access-Token',
                      title: '登录授权码',
                      desc: 'Access-Token from oauth2 if use token access mode',
                      $appendix$: true,
                      data: null,
                      in: 'header',
                      mock: 'H3K56789lHIUkjfkslds',
                    },
                    {
                      type: 'object',
                      name: 'root',
                      desc: 'body inputs',
                      data: [
                        {
                          type: 'object',
                          name: 'entity',
                          desc: 'entity',
                          data: [
                            {
                              type: 'string',
                              name: 'field_XPzC63rz',
                              title: '单行文本',
                              data: null,
                            },
                          ],
                        },
                        {
                          type: 'object',
                          name: 'query',
                          data: [
                            {
                              type: 'object',
                              name: 'term',
                              data: [
                                {
                                  type: 'string',
                                  name: '_id',
                                  data: null,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          type: 'string',
                          name: 'x_polyapi_signature',
                          title: '参数签名',
                          desc: 'required if Access-Token doesn\'t use.\nHmacSHA256 signature of input body: sort query gonic asc|sha256 <SECRET_KEY>|base64 std encode',
                          $appendix$: true,
                          data: 'EJML8aQ3BkbciPwMYHlffv2BagW0kdoI3L_qOedQylw',
                        },
                      ],
                      in: 'body',
                    },
                  ],
                },
                output: {
                  body: {
                    type: '',
                    name: '',
                    data: null,
                  },
                  doc: [
                    {
                      type: 'object',
                      data: [
                        {
                          type: 'number',
                          name: 'code',
                          title: '状态码',
                          data: null,
                        },
                        {
                          type: 'object',
                          name: 'data',
                          data: [
                            {
                              type: 'string',
                              name: 'updated_at',
                              title: '修改时间',
                              data: null,
                            },
                            {
                              type: 'string',
                              name: '_id',
                              title: 'id',
                              data: null,
                            },
                            {
                              type: 'string',
                              name: 'created_at',
                              title: '创建时间',
                              data: null,
                            },
                            {
                              type: 'string',
                              name: 'creator_id',
                              title: '创建者 ID',
                              data: null,
                            },
                            {
                              type: 'string',
                              name: 'creator_name',
                              title: '创建者',
                              data: null,
                            },
                            {
                              type: 'string',
                              name: 'field_XPzC63rz',
                              title: '单行文本',
                              data: null,
                            },
                            {
                              type: 'string',
                              name: 'modifier_id',
                              title: '修改者 ID',
                              data: null,
                            },
                            {
                              type: 'string',
                              name: 'modifier_name',
                              title: '修改者',
                              data: null,
                            },
                          ],
                        },
                        {
                          type: 'string',
                          name: 'msg',
                          title: '错误信息',
                          data: null,
                        },
                      ],
                      in: 'body',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ];
    expect(store.getValue().apiDatas).toHaveLength(1);
    await store.getApiList(firstDirectory);
    await store.getApiDoc(firstAPI, 'raw');
    expect(store.getValue().apiDatas).toEqual(expectedResult);
  });
});
