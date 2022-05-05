import { BehaviorSubject } from 'rxjs6';
import { lensPath, set, dissocPath, path } from 'ramda';

import { PolyCanvasStore } from './canvas';

function getInitPolyInfo(): POLY_API.POLY_INFO {
  return {
    id: '', owner: '', ownerName: '', namespace: '', name: '', title: 'API名称',
    active: 0, desc: '', access: [], method: '', createAt: '', updateAt: '', buildAt: '',
  };
}

function getDefaultState(): POLY_API.Root {
  return {
    currentNodeConfigParams: {
      currentNode: undefined,
      schema: {},
      onClose: undefined,
      excludedFields: [],
    },
    nodes: new PolyCanvasStore([]),
    polyInfo: getInitPolyInfo(),
  };
}

class PolyStore extends BehaviorSubject<POLY_API.Root> {
  constructor(initialState: POLY_API.Root) {
    super(initialState);
  }

  set(key: string, value: any): void {
    this.next(set(lensPath(key.split('.')), value, this.value));
  }

  setSource(polyInfo: POLY_API.POLY_INFO, nodes: POLY_API.Element[]): void {
    this.nodes$.set(nodes);
    this.set('polyInfo', polyInfo);
  }

  get<T>(key: string): T {
    return path(key.split('.'), this.value) as T;
  }

  get nodes$(): PolyCanvasStore {
    return this.value.nodes;
  }

  unset(key: string): void {
    this.next(dissocPath(key.split('.'), this.value));
  }

  getRootValue(): POLY_API.PlainRoot {
    const { nodes, ...valueWithoutNodes } = this.value;
    return { ...valueWithoutNodes, nodes: nodes.getElementsValue() };
  }
}

const store$ = new PolyStore(getDefaultState());

export default store$;
