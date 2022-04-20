import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';
import { Schema } from '@lib/api-adapter/swagger-schema-official';

export default class FieldsStore extends TreeStore<Schema &{acceptable?: boolean}> {
  treeNodeHeight = 36;

  constructor(
    root: Schema,
    params: { [propertyName: string]: Schema },
  ) {
    super({
      rootNode: apiFieldsToTreeNode(params || {}, root, root.properties || {}),
      singleMode: true,
      disableExpandNodeOnSelect: true,
    }, true);
  }
}

export function apiFieldsToTreeNode(
  // {name: schema, age:schema }
  params: { [propertyName: string]: Schema },
  // {type: object, prop: {name: schema, age:schema ,data:schema}}
  fields: Schema,
  // {name: schema, age:schema ,data:schema}
  properties: { [propertyName: string]: Schema },
  level = 1,
  visible = false,
  expanded = true,
  parentId = '',
  order = 0,
  sort = false,
  id = 'schema',
): TreeNode<Schema> {
  let children = Object.entries(properties || {}).map(
    // [name, schema]  // {type: string, pro: {} }
    ([fieldKey, fieldAttrs]) => {
      // properties
      const _properties = properties?.[fieldKey]?.properties || {};
      // console.log(_properties);
      // console.log( params?.[id]?.properties);
      // console.log(1 === 1);
      // console.log(level === 1);
      // console.log(level === 1 ? params : params?.[id]?.properties || {} );
      const _params = level === 1 ? params : params?.[id]?.properties || {};
      return apiFieldsToTreeNode(
        // level !== 2 ? name: schema || {} : {name: schema, age:schema },
        _params,
        // neme: {type: string, pro: {} }
        fieldAttrs,
        // {xing: scheme, ming:schema}
        _properties,
        level + 1,
        true,
        false,
        id,
        stringToAsciiNumber(fieldKey || ''),
        sort,
        fieldKey,
      );
    },
  );

  if (sort) {
    children = children.sort(treeNodeSorter);
  }

  const acceptable = !!params?.[id];

  return {
    data: { ...fields, ...{ acceptable } },
    name: fields?.title || '',
    id,
    parentId: parentId || id || '',
    path: `${parentId}/${id}`,
    isLeaf: fields.type !== 'object',
    visible: visible,
    childrenStatus: 'unknown',
    expanded,
    order,
    level,
    children,
  };
}

export function stringToAsciiNumber(value: string): number {
  return value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function treeNodeSorter(nodeA: TreeNode<any>, nodeB: TreeNode<any>): 1 | -1 {
  if (nodeA.isLeaf === nodeB.isLeaf) {
    return nodeA.order < nodeB.order ? -1 : 1;
  }

  return nodeA.isLeaf ? 1 : -1;
}

export function turnFieldsWithState(
  params: { [propertyName: string]: Schema },
  fields: { [propertyName: string]: Schema },
): { [propertyName: string]: Schema & { checked?: boolean, id?: string } } {
  const fieldsWithState: { [propertyName: string]: Schema & { checked?: boolean, id?: string } } = fields;
  // if (!Object.keys(params).length) return fields;

  Object.entries(fields).forEach(([key, value]) => {
    const checked = !!params[key];
    fieldsWithState[key].checked = checked;
    fieldsWithState[key].id = key;
    turnFieldsWithState(params?.[key]?.properties || {}, value.properties || {});
  });
  return fieldsWithState;
}
