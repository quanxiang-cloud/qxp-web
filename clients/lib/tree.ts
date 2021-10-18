import { curry, map, clone } from 'ramda';

const { isArray } = Array;

type Reducer<T, S> = (
  accumulator: T, node: S, currentIndex: number | string | undefined, data?: any, path?: string
) => T;
function treeReduce<T, S extends Record<string, any>>(
  reducer: Reducer<T, S>,
  _childKey: string | string[],
  init: T,
  _node: S,
  currentIndex?: string | number,
  fieldPath = `${currentIndex || ''}`,
): T {
  if (!_node) {
    return init;
  }
  const node = clone(_node);
  !isArray(node) && Object.assign(node, { fieldPath });

  const currentReducer = (
    accumulator: T, child: S, currentIndex: number | string | undefined, _?: any, _fieldPath?: string,
  ): T => {
    const currentPath = `${fieldPath ? `${fieldPath}.` : ''}${_fieldPath || currentIndex}`;
    return treeReduce(reducer, _childKey, accumulator, child, currentIndex, currentPath);
  };

  const acc = reducer(init, node, currentIndex);
  if (isArray(node)) {
    return node.reduce<T>(currentReducer, acc);
  }

  const childKey = getChildKey(_childKey, node);
  const currentChild: S[] | Record<string, S> & S | undefined = node?.[childKey];
  if (!hasChildren(childKey, node) || !currentChild) {
    return acc;
  }

  if (isArray(currentChild)) {
    return currentChild.reduce<T>(currentReducer, acc);
  }

  return reduceObject<T, S>(currentReducer, acc, currentChild, _childKey);
}

type Mapper<T> = (node: T) => T;
type TreeMap<T extends Record<string, any>> = (mapper: Mapper<T>, childKey: string | string[], node: T) => T
function treeMap<T extends Record<string, any> >(
  mapper: Mapper<T>,
  _childKey: string | string[],
  node: T,
): T {
  const newNode = mapper(node);
  const childKey = getChildKey(_childKey, node);
  if (!hasChildren<T>(childKey, newNode)) {
    return newNode;
  }
  const currentChild = newNode?.[childKey];
  const curriedTreeMap = curry<TreeMap<T>>(treeMap);
  const currentMapper = curriedTreeMap(mapper, _childKey);
  return {
    ...newNode,
    [childKey]: isArray(currentChild) ? currentChild?.map(currentMapper) : mapObject(
      currentMapper, currentChild, _childKey,
    ),
  };
}

function toArray<T extends Record<string, any>>(childKey: string | string[], tree: T): T[] {
  function flattenToArray(arr: T[], node: T, nodeIndex?: string | number): T[] {
    Object.assign(node, { fieldIndex: nodeIndex });
    return arr.concat(node);
  }
  return treeReduce(flattenToArray, childKey, [], tree);
}

function hasChildren<T extends Record<string, any>>(childKey: string, node: T): boolean {
  const currentChild = node?.[childKey];
  return isArray(currentChild) ? !!currentChild?.length : !!currentChild;
}

function reduceObject<T, S extends Record<string, any>>(
  reducer: Reducer<T, S>, acc: T, currentValue: Record<string, S>, _childKey: string | string[],
): T {
  return Object.entries(currentValue).reduce((acc: T, [key, value]) => {
    const childKey = getChildKey(_childKey, value);
    const child = value?.[childKey];
    const accumulator = reducer(acc, value, key, currentValue);
    if (child) {
      return reducer(accumulator, child, childKey, currentValue, key);
    }
    return accumulator;
  }, acc);
}

function mapObject<T>(
  mapper: Mapper<T>, currentValue: any, _childKey: string | string[],
): Record<string, any> {
  const newValue = map(mapper, currentValue) as Record<string, any>;
  const childKey = getChildKey(_childKey, newValue);
  const child = newValue?.[childKey];
  if (child) {
    newValue[childKey] = map(mapper, child);
  }
  return newValue;
}

function getChildKey<S extends Record<string, any>>(_childKey: string | string[], node: S): string {
  return (isArray(_childKey) ? _childKey.find((key) => !!node?.[key]) : _childKey) || '';
}

const treeUtil = {
  hasChildren: curry(hasChildren),
  map: curry(treeMap),
  reduce: treeReduce,
  toArray,
};

export default treeUtil;
