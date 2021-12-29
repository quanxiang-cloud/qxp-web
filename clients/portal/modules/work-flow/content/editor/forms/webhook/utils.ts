import { isString, flattenDeep } from 'lodash';
import { Node, isNode } from 'react-flow-renderer';

import store, { getNodeElementById } from '@flow/content/editor/store';
import { Data } from '@flow/content/editor/type';

function getElementParents(element: Node<Data>): string[] {
  return flattenDeep(element?.data?.nodeData.parentID?.map((id) => {
    const cur = getNodeElementById(id);
    return cur ? [...getElementParents(cur), id] : id;
  }) ?? []);
}

export function webhookPathTreeSourceGetter(
  tableSchema: SchemaFieldItem[], variables: ProcessVariable[] = [],
) {
  return (): POLY_API.PolyNodeInput[] => {
    const { nodeIdForDrawerForm, elements } = store.getValue();
    const currentElement = getNodeElementById(nodeIdForDrawerForm);
    const currentElementParents: string[] = getElementParents(currentElement);

    const sourceFromElements = elements.map((item): POLY_API.PolyNodeInput | false => {
      if (!isNode(item) || item === currentElement) {
        return false;
      }
      if (item.data?.type === 'formData') {
        return {
          type: 'object',
          data: tableSchema.map((schema) => {
            return {
              type: schema.type as POLY_API.API_FIELD_TYPE,
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
  };
}
