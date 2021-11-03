import { observable, action, computed, toJS } from 'mobx';
import { nanoid } from 'nanoid';
import { set, pick, omit } from 'lodash';

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
  }, options || {});
}

function mapRawParams(params: ApiParam[], mergeOptions?: Record<string, any>): ParamItem[] {
  return params.filter(({ name })=> !!name).map((v)=> {
    return Object.assign(pick(v, ['name', 'type', 'required', 'description']), mergeOptions || {});
  });
}

function mapObjectParam(): void {
  // todo
}

function mapArrayParam(): void {
  // todo
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

  @computed get swaggerParameters(): Record<'constants' | 'parameters' | 'response', any> {
    const { path, query, header, body, constant, response } = toJS(this.parameters);

    return {
      constants: mapRawParams(constant),
      parameters: [
        ...mapRawParams(path, { in: 'path' }),
        ...mapRawParams(query, { in: 'query' }),
        ...mapRawParams(header, { in: 'header' }),
        ...mapRawParams(body, { in: 'body' }),
      ],
      response: {
        200: {
          description: 'successful operation',
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
  addSubParam=()=> {
    // todo: handle sub level params, object, array
  }

  @action
  removeParam=(group: ParamGroup, rowId: string)=> {
    if (group === 'path') {
      return;
    }
    this.parameters[group] = this.parameters[group].filter(({ id })=> id !== rowId);
    if (!this.parameters[group].length) {
      this.parameters[group] = [getDefaultParam()];
    }
  }

  @action
  reset=()=> {
    this.parameters = getDefaultParameters();
  }
}
