import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';

export default class FieldsStore extends TreeStore<TreeField> {
  treeNodeHeight = 36;

  constructor(
    root: SwagFieldSchema,
    params: { [propertyName: string]: SwagFieldSchema },
  ) {
    super({
      rootNode: apiFieldsToTreeNode(params || {}, root, root.properties || {}),
      singleMode: true,
      disableExpandNodeOnSelect: true,
    }, true);
  }
}

export function apiFieldsToTreeNode(
  params: { [propertyName: string]: SwagFieldSchema },
  fields: SwagFieldSchema,
  properties: { [propertyName: string]: SwagFieldSchema },
  level = 0,
  visible = false,
  expanded = true,
  parentId = '',
  order = 0,
  sort = false,
  id = 'schema',
): TreeNode<SwagFieldSchema> {
  let children = Object.entries(properties || {}).map(
    ([fieldKey, fieldAttrs]) => {
      const _properties = properties?.[fieldKey]?.properties || {};
      const _params = level === 0 ? params : params?.[id]?.properties || {};
      return apiFieldsToTreeNode(
        _params,
        fieldAttrs,
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

