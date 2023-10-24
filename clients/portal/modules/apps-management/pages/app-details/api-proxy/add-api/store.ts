import { observable, action, computed, toJS } from 'mobx';
import { nanoid } from 'nanoid';
import { get, set, pick, omit } from 'lodash';

import toast from '@lib/toast';

import type { ApiParam, ParamType, ParamGroup } from './params-config';

type ParamItem=Record<string, any>

type MetaInfo={
  title: string;
  apiPath: string;
  apiName: string;
  method: string;
  description: string;
}

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

const paramGroups = ['path', 'query', 'header', 'body'];
const defaultMetaInfo: MetaInfo = {
  title: '',
  method: 'post',
  apiName: '',
  apiPath: '',
  description: '',
};

function applySubNodes(item: any, isRoot: boolean, objectNodes?: Array<any>, arrayNodes?: Array<any>): void {
  let target = item;

  if (isRoot) {
    if (item.in === 'body') {
      item.schema = {
        type: item.type,
      };
      target = item.schema;
    }
  }

  if (arrayNodes) {
    const items = omit(mapRawParams(arrayNodes, {}, true)[0], 'name', 'required');

    Object.assign(target, {
      items,
    });
  }
  if (objectNodes) {
    const requiredKeys: string[] = objectNodes.filter((v: ApiParam)=> v.required).map((v: ApiParam)=> v.name);
    const properties = mapRawParams(objectNodes)?.reduce((acc, cur)=> {
      acc[cur.name] = omit(cur, 'name', 'required');
      return acc;
    }, {});

    Object.assign(target, {
      required: requiredKeys.filter(Boolean),
      properties,
    });
  }
}

function mapRawParams(
  params: ApiParam[], mergeOptions?: Record<string, any>, isArrayNodes?: boolean,
): ParamItem[] {
  return params.filter(({ name })=> !!name || isArrayNodes).map((v)=> {
    const item = Object.assign({}, pick(v, reservedKeys), pick(mergeOptions || {}, 'in'));
    const { _array_nodes_: arrayNodes, _object_nodes_: objectNodes } = item;

    applySubNodes(item, mergeOptions?.root, objectNodes, arrayNodes);

    // constant
    if (!mergeOptions?.in && item.constIn) {
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

function mapRawBodyParams(params: ApiParam[], mergeOptions?: Record<string, any>): ParamItem {
  const bodyParams: ApiParam[] = [{
    constData: '',
    constIn: '',
    description: '',
    id: '',
    name: 'temporaryname',
    required: false,
    type: '' as ParamType,
    _object_nodes_: params,
  }];
  const item = mapRawParams(bodyParams, mergeOptions)[0];

  delete item.name;
  delete item.description;
  delete item.required;

  return item;
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

// map object/array node schema to _object_nodes_, _array_nodes_ structure recursively
function mapObjectNode(node: Record<string, any>, isRoot?: boolean): Record<string, any> {
  const { required: requiredKeys = [], properties = {}, items = {}, type } = isRoot ? node.schema : node;
  delete node.schema;
  delete node.required;
  delete node.properties;

  function applyObjectProperties(properties: any): any[] {
    return Object.entries(properties).map(([name, conf]: [string, any])=> {
      const preload = getDefaultParam({ name, required: requiredKeys.includes(name) });
      if (['object', 'array'].includes(conf.type)) {
        return { ...preload, ...mapObjectNode(conf) };
      }
      return { ...preload, ...conf };
    });
  }

  function applyArrayProperties(arrayItems: any): any {
    const preload = getDefaultParam();
    if (['object', 'array'].includes(arrayItems.type)) {
      return [{ ...preload, ...mapObjectNode(arrayItems) }];
    }
    return [{ ...preload, ...arrayItems }];
  }

  if (type === 'object') {
    node._object_nodes_ = applyObjectProperties(properties);
  }
  if (type === 'array') {
    node._array_nodes_ = applyArrayProperties(items);
  }
  return node;
}

export default class Store {
  @observable parameters: Record<ParamGroup, ApiParam[]> = getDefaultParameters();
  @observable metaInfo: MetaInfo = { ...defaultMetaInfo };
  @observable apiPath = '';

  @computed get swaggerParameters(): Record<'constants' | 'parameters' | 'responses', any> {
    const { path, query, header, body, constant, response } = toJS(this.parameters);

    return {
      constants: mapRawParams(constant),
      parameters: [
        ...mapRawParams(path, { in: 'path', root: true }),
        ...mapRawParams(query, { in: 'query', root: true }),
        ...mapRawParams(header, { in: 'header', root: true }),
        // in-body 参数都放在schema属性里
        mapRawBodyParams(body, { in: 'body', root: true }),
      ],
      responses: {
        200: {
          schema: {
            type: 'object',
            required: response.filter((v: ApiParam)=> v.required).map((v: ApiParam)=> v.name),
            properties: mapRawParams(response, { root: true })?.reduce((acc, cur)=> {
              delete cur.required;
              acc[cur.name] = omit(cur, 'name');
              return acc;
            }, {}),
          },
        },
      },
    };
  }

  @action
  setMetaInfo = (info: Partial<MetaInfo>): void => {
    this.metaInfo = { ...this.metaInfo, ...info };
  };

  @action
  setParams = (group: ParamGroup, params: ApiParam[]): void => {
    Object.assign(this.parameters, { [group]: [...params, getDefaultParam()] });
  };

  @action
  setAllParameters = (params: ApiParam[]): void =>{
    paramGroups.forEach((gp)=> {
      const items = params.map((v)=> {
        if (v.in !== gp) {
          return;
        }

        const preload = getDefaultParam();
        if (v.in === 'body') {
          return mapObjectNode(v, true);
        }

        if (['object', 'array'].includes(v.type)) {
          return mapObjectNode(v, false);
        }

        return { ...preload, ...omit(v, 'in') };
      }).filter(Boolean);
      if (items[0]?.in === 'body') {
        this.setParams(gp as ParamGroup, items[0]?._object_nodes_ || []);
      } else {
        this.setParams(gp as ParamGroup, items as ApiParam[] || []);
      }
    });
  };

  @action
  setConstants = (consts: ApiParam[]): void => {
    const constItems = consts.map((v)=> {
      return {
        ...getDefaultParam(),
        ...omit(v, ['in', 'data']),
        constIn: v.in || 'body',
        constData: v.data || '',
      };
    });
    this.setParams('constant', constItems);
  };

  @action
  setResponse = (resp: Record<string, any>): void => {
    const respItems = mapObjectNode(get(resp, '200.schema', {}));
    this.setParams('response', respItems._object_nodes_ || []);
  };

  @action
  setFieldValue = (fieldPath: string, val: any): void=> {
    set(this.parameters, fieldPath, val);
  };

  @action
  addParam = (group: ParamGroup, idx: number): void => {
    if (idx + 1 < this.parameters[group].length) {
      return;
    }
    // path params is readonly
    if (group !== 'path') {
      this.parameters[group] = [...this.parameters[group], getDefaultParam()];
    }
  };

  @action
  addSubParam = (group: string, parentPath: string, idx: number, isArray = false): void => {
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
    const finalPath = [
      [parentPath || group, idx].join('.'), isArray ? '_array_nodes_' : '_object_nodes_',
    ].join('.');
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
  };

  @action
  resetSubNodesByType = (path: string): void => {
    const parentPath = path.slice(0, path.lastIndexOf('.'));
    set(this.parameters, [parentPath, '_object_nodes_'].join('.'), null);
    set(this.parameters, [parentPath, '_array_nodes_'].join('.'), null);
  };

  @action
  removeParam = (group: ParamGroup, parentPath: string, idx: number): void => {
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
  };

  @action
  reset = (): void => {
    this.parameters = getDefaultParameters();
    this.setMetaInfo({ ...defaultMetaInfo });
  };
}
