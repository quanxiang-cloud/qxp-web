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
  required?: string[],
}

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
    required = [],
  }: FieldNode,
): TreeNode<SwagField> {
  const children = Object.entries(properties || {}).map(
    ([fieldKey, fieldAttrs], index) => {
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
        order: index,
        sort,
        id: fieldKey,
        required: fields?.required || [],
      };
      return apiFieldsToTreeNode(_fieldNode);
    },
  );

  const acceptable = !!params?.[id] || false;
  const _required = required.includes(id) || !!fields.required || false;

  return {
    data: { ...fields, acceptable, must: _required, id },
    name: fields?.title || id || '',
    id: `${parentId}-${id}`,
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

export function clearChildState(
  node: TreeNode<SwagField>,
  store: TreeStore<SwagField>,
): void {
  node.children?.forEach((child) => {
    const { data } = child;
    data.acceptable = false;
    store.updateNode({ ...child, data });
    clearChildState(child, store);
  });
}

export function addParentState(
  node: TreeNode<SwagField>,
  store: TreeStore<SwagField>,
): void {
  const parents = store.getNodeParents(node.id);
  parents.forEach((parentNode) => {
    const { data } = parentNode;
    data.acceptable = true;
    store.updateNode({ ...parentNode, data });
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
    addParentState(node, store);
  } else {
    clearChildState(node, store);
  }
}
