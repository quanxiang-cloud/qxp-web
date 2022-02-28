import { BehaviorSubject } from 'rxjs';
import { isEdge, isNode } from 'react-flow-renderer';

import { savePolyApiResult } from '@polyApi/utils/build';

export class PolyCanvasStore extends BehaviorSubject<POLY_API.Element[]> {
  constructor(initialValue: POLY_API.Element[]) {
    super(initialValue);
  }

  get nodes(): POLY_API.NodeElement[] {
    return this.value.filter((node) => isNode(node)) as POLY_API.NodeElement[];
  }

  get edges(): POLY_API.EdgeElement[] {
    return this.value.filter((edge) => isEdge(edge)) as POLY_API.EdgeElement[];
  }

  add(element: POLY_API.Element): void {
    this.next([...this.value, element]);
  }

  reset(): void {
    this.next([]);
  }

  set(elements: POLY_API.Element[], isSave = false): void {
    this.next(elements);
    isSave && savePolyApiResult();
  }

  getElementsValue(): POLY_API.PlainElement[] {
    return this.value.map((element): POLY_API.PlainElement => {
      const { data, ...elementWithoutData } = element;
      return { ...elementWithoutData, data: data?.value };
    });
  }
}
