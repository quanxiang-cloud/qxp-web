import { isString, flattenDeep, isArray, isObject } from 'lodash';
import { Node, isNode } from 'react-flow-renderer';
import { mergeLeft, flatten } from 'ramda';

import store, { getNodeElementById } from '@flow/content/editor/store';
import { Data, Input } from '@flow/content/editor/type';

function getElementParents(element: Node<Data>): string[] {
  return flattenDeep(element?.data?.nodeData.parentID?.map((id) => {
    const cur = getNodeElementById(id);
    return cur ? [...getElementParents(cur), id] : id;
  }) ?? []);
}

export function getWebhookPathTreeValue(
  tableSchema: SchemaFieldItem[], variables: ProcessVariable[] = [],
): POLY_API.PolyNodeInput[] {
  const { nodeIdForDrawerForm, elements } = store.getValue();
  const currentElement = getNodeElementById(nodeIdForDrawerForm);
  const currentElementParents: string[] = getElementParents(currentElement);
  const sourceFromElements = elements.map((item): POLY_API.PolyNodeInput | false => {
    if (!isNode(item) || item === currentElement) {
      return false;
    }
    if (item.data && isObject(item.data) && !item.data?.type) {
      item.data.type = item?.type;
    }
    if (item.data?.type === 'formData') {
      return {
        type: 'object',
        data: tableSchema.map((schema) => {
          const SubTable = 'SubTable';
          const Foregin_Table = 'foreign_table';
          const ForeignTable = 'ForeignTable';
          const subordination = schema['x-component-props']?.subordination;
          const fieldType = schema['x-component'] ? schema['x-component'] : '';
          return {
            type: schema.type as POLY_API.API_FIELD_TYPE,
            fieldType: (fieldType === SubTable && subordination === Foregin_Table) ? ForeignTable : fieldType,
            fieldName: schema.fieldName ? schema.fieldName : '',
            tableID: schema['x-component-props']?.tableID ? schema['x-component-props']?.tableID : '',
            in: '',
            desc: isString(schema.title) ? schema.title : '',
            name: isString(schema.fieldName) ? schema.fieldName : '',
            data: [],
          };
        }),
        in: '',
        desc: item.data.nodeData.name,
        name: item.id,
      };
    }
    if (item.data?.type === 'webhook' && currentElementParents.includes(item.id)) {
      return {
        type: 'object',
        data: item.data.businessData.config.outputs ?? [],
        in: '',
        desc: item.data.nodeData.name,
        name: item.id,
      };
    }
    if (item.data?.type === 'fillIn') {
      return {
        type: 'object',
        data: [{
          type: 'string',
          in: '',
          desc: '填写人名称',
          name: 'handleUserName',
          data: [],
        }, {
          type: 'string',
          in: '',
          desc: '填写人ID',
          name: 'handleUserId',
          data: [],
        }, {
          type: 'string',
          in: '',
          desc: '填写时间',
          name: 'handleTime',
          data: [],
        }],
        in: '',
        desc: item.data.nodeData.name,
        name: item.id,
      };
    }
    if (item.data?.type === 'approve') {
      return {
        type: 'object',
        data: [{
          type: 'string',
          in: '',
          desc: '审批人名称',
          name: 'handleUserName',
          data: [],
        }, {
          type: 'string',
          in: '',
          desc: '审批人ID',
          name: 'handleUserId',
          data: [],
        }, {
          type: 'string',
          in: '',
          desc: '审批时间',
          name: 'handleTime',
          data: [],
        }],
        in: '',
        desc: item.data.nodeData.name,
        name: item.id,
      };
    }
    return false;
  }).filter((source): source is POLY_API.PolyNodeInput => !!source);

  return sourceFromElements.concat({
    type: 'object',
    data: variables.map((variable: ProcessVariable): POLY_API.PolyNodeInput => {
      return {
        type: variable.type as POLY_API.API_FIELD_TYPE,
        in: '',
        desc: variable.name,
        name: variable.code,
        data: [],
      };
    }),
    in: '',
    desc: '自定义变量',
    name: 'variable',
  });
}

export function isUrl(value: string): boolean {
  return /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/.test(value);
}

export function inputValidator(value: Input[]): boolean | string {
  let isValid: string | boolean = true;
  function loopValue(v: Input[]): void {
    v.forEach((v) => {
      if (isArray(v)) {
        loopValue(v);
      }
      if (v.required && !v.data) {
        isValid = `请输入${v.name}配置`;
      }
    });
  }
  loopValue(value);
  return isValid;
}

export function requestApiValidator({ value }: { value: string}): true | string {
  return value ? true : '请选择触发的API';
}

type Output = Input & { level: number; };
export function flattenOutputs(outputs: Input[], level = 1): Output[] {
  return flatten(outputs.map((output) => {
    const current = mergeLeft(output, { level });
    if ((output.type === 'object' || output.type === 'array') && isArray(output.data)) {
      return [current, ...flattenOutputs(output.data, level + 1)];
    }
    return current;
  }));
}
