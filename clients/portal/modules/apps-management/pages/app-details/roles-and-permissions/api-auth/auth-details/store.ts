import TreeStore from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';

export default class FieldsStore extends TreeStore<SwagField> {
  treeNodeHeight = 36;

  constructor(
    root: SwagSchema,
    params: { [propertyName: string]: SwagSchema },
  ) {
    super({
      rootNode: apiFieldsToTreeNode({ params, fields: root, properties: root.properties || {} }),
      singleMode: true,
      disableExpandNodeOnSelect: true,
    }, true);
  }
}

type FieldNode = {
  params: { [propertyName: string]: SwagSchema },
  fields: SwagSchema,
  properties: { [propertyName: string]: SwagSchema },
  level?: number,
  visible?: boolean,
  expanded?: boolean,
  parentId?: string,
  order?: number,
  sort?: boolean,
  id?: string,
}

// 参数 对象形式
export function apiFieldsToTreeNode(
  {
    params = {},
    fields,
    properties = {},
    level = 0,
    visible = false,
    expanded = true,
    parentId = '',
    order = 0,
    sort = false,
    id = 'schema',
  }: FieldNode,
): TreeNode<SwagField> {
  let children = Object.entries(properties || {}).map(
    ([fieldKey, fieldAttrs]) => {
      const _properties = properties?.[fieldKey]?.properties || {};
      const _params = level === 0 ? params : params?.[id]?.properties || {};
      const _fieldNode = {
        params: _params,
        fields: fieldAttrs,
        properties: _properties,
        level: level + 1,
        visible: true,
        expanded: false,
        parentId: id,
        order: stringToAsciiNumber(fieldKey || ''),
        sort,
        id: fieldKey,

      };
      return apiFieldsToTreeNode(_fieldNode);
    },
  );

  // to fix
  if (sort) {
    children = children.sort(treeNodeSorter);
  }

  const acceptable = !!params?.[id] || false;

  return {
    data: { ...fields, acceptable },
    name: fields?.title || '',
    id,
    parentId: parentId || id || '',
    path: `${parentId}/${id}`,
    isLeaf: !fields.properties,
    visible: visible,
    childrenStatus: 'unknown',
    expanded,
    order,
    level,
    children,
  };
}

// import delete
export function stringToAsciiNumber(value: string): number {
  return value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function treeNodeSorter(nodeA: TreeNode<any>, nodeB: TreeNode<any>): 1 | -1 {
  if (nodeA.isLeaf === nodeB.isLeaf) {
    return nodeA.order < nodeB.order ? -1 : 1;
  }

  return nodeA.isLeaf ? 1 : -1;
}

export function clearChildState(
  node: TreeNode<SwagField>,
  store: TreeStore<SwagField>,
  acceptable: boolean): any {
  node.children?.forEach((child) => {
    const { data } = child;
    data.acceptable = acceptable;
    store.updateNode({ ...child, data });
    clearChildState(child, store, false);
  });
}

export function onChangeFieldState(
  node: TreeNode<SwagField>,
  store: TreeStore<SwagField>,
  acceptable: boolean,
): void {
  const { data } = node;
  data.acceptable = acceptable;
  store.updateNode({ ...node, data });
  if (acceptable) {
    const parents = store.getNodeParents(node.id);
    parents.forEach((parentNode) => {
      const { data } = parentNode;
      data.acceptable = acceptable;
      store.updateNode({ ...parentNode, data });
    });
  } else {
    clearChildState(node, store, false);
  }
}
