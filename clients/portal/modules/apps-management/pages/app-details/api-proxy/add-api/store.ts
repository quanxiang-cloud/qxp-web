import { observable, action, computed, toJS } from 'mobx';
import { nanoid } from 'nanoid';
import { get, set, pick, omit } from 'lodash';

import toast from '@lib/toast';

import type { ApiParam, ParamType, ParamGroup } from './params-config';

type ParamItem=Record<string, any>

function randomId(): string {
  return nanoid(8);
}

export function getDefaultParam(options?: Record<string, any>): ApiParam {
  return Object.assign({
    id: randomId(),
    name: '',
    type: 'string' as ParamType,
    required: false,
    description: '',
    constIn: '',
    constData: '',
  }, options || {});
}

const reservedKeys = [
  'name',
  'type',
  'required',
  'description',
  'constIn',
  'constData',
  '_object_nodes_',
  '_array_nodes_',
];

function mapRawParams(params: ApiParam[], mergeOptions?: Record<string, any>): ParamItem[] {
  return params.filter(({ name })=> !!name).map((v)=> {
    const item = Object.assign(pick(v, reservedKeys), mergeOptions || {});
    const { _array_nodes_: arrayNodes, _object_nodes_: objectNodes } = item;

    if (item.in === 'body') {
      item.schema = {
        type: item.type,
      };

      if (arrayNodes) {
        item.schema.items = mapRawParams(arrayNodes).reduce((acc, cur)=> {
          acc[cur.name] = omit(cur, 'name', 'required');
          return acc;
        }, {});
      }
      if (objectNodes) {
        item.schema.properties = mapRawParams(objectNodes).reduce((acc, cur)=> {
          acc[cur.name] = omit(cur, 'name', 'required');
          return acc;
        }, {});
      }
      delete item.type;
    }

    if (!mergeOptions?.in && item.constIn) {
      // constant
      item.in = item.constIn;
      item.data = item.constData;
      delete item.required;
    }

    delete item._array_nodes_;
    delete item._object_nodes_;
    delete item.constIn;
    delete item.constData;

    return item;
  });
}

function getDefaultParameters(): Record<ParamGroup, ApiParam[]> {
  return {
    path: [],
    query: [getDefaultParam()],
    header: [getDefaultParam()],
    body: [getDefaultParam()],
    constant: [getDefaultParam()],
    response: [getDefaultParam()],
  };
}

export default class Store {
  @observable parameters: Record<ParamGroup, ApiParam[]> = getDefaultParameters()

  @observable method = 'post'

  @computed get swaggerParameters(): Record<'constants' | 'parameters' | 'responses', any> {
    const { path, query, header, body, constant, response } = toJS(this.parameters);

    return {
      constants: mapRawParams(constant),
      parameters: [
        ...mapRawParams(path, { in: 'path' }),
        ...mapRawParams(query, { in: 'query' }),
        ...mapRawParams(header, { in: 'header' }),
        // in-body 参数都放在schema属性里
        ...mapRawParams(body, { in: 'body' }),
      ],
      responses: {
        200: {
          schema: {
            type: 'object',
            title: 'api result',
            properties: mapRawParams(response).reduce((acc, cur)=> {
              acc[cur.name] = omit(cur, 'name');
              return acc;
            }, {}),
          },
        },
      },
    };
  }

  @action
  setMethod=(method: string)=> {
    this.method = method;
  }

  @action
  setParams=(group: ParamGroup, params: ApiParam[])=> {
    Object.assign(this.parameters, { [group]: params });
  }

  @action
  setFieldValue=(fieldPath: string, val: any): void=> {
    set(this.parameters, fieldPath, val);
  }

  @action
  addParam=(group: ParamGroup, idx: number)=> {
    if (idx + 1 < this.parameters[group].length) {
      return;
    }
    // path params is readonly
    if (group !== 'path') {
      this.parameters[group] = [...this.parameters[group], getDefaultParam()];
    }
  }

  @action
  addSubParam=(group: string, parentPath: string, idx: number, isArray = false)=> {
    /*
      body_params: {
        name: '',
        type: 'object',
        _object_nodes_: [
          {
            name: '',
            type: 'object',
            _object_nodes_: [
              {...}
            ]
          }
        ]
      }
     */
    const finalPath = [[parentPath || group, idx].join('.'), isArray ? '_array_nodes_' : '_object_nodes_'].join('.');
    if (!get(this.parameters, finalPath)) {
      set(this.parameters, finalPath, []);
    }
    const target = get(this.parameters, finalPath);
    if (isArray && target.length) {
      toast.error('数组项下只能添加一种类型');
      return;
    }
    target.push(getDefaultParam());
    set(this.parameters, finalPath, target);
  }

  @action
  resetSubNodesByType=(path: string)=> {
    const parentPath = path.slice(0, path.lastIndexOf('.'));
    set(this.parameters, [parentPath, '_object_nodes_'].join('.'), null);
    set(this.parameters, [parentPath, '_array_nodes_'].join('.'), null);
  }

  @action
  removeParam=(group: ParamGroup, parentPath: string, idx: number)=> {
    const prefix = parentPath || group;
    if (group === 'path') {
      return;
    }
    const target = get(this.parameters, prefix);
    target && target.splice(idx, 1);
    // always keep at least one item
    if (!this.parameters[group].length) {
      this.parameters[group] = [getDefaultParam()];
    }
  }

  @action
  reset=()=> {
    this.parameters = getDefaultParameters();
    this.method = 'post';
  }
}
