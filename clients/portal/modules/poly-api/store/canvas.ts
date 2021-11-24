import { BehaviorSubject } from 'rxjs';
import { omit, merge } from 'ramda';
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

  set(elements: POLY_API.Element[], isSave = false): void {
    const elementsMap = elements.reduce((acc: Record<string, POLY_API.Element>, element) => {
      acc[element.id] = element;
      return acc;
    }, {});
    const idToRemove: string[] = [];
    const newValue: POLY_API.Element[] = [];
    this.value.forEach((element) => {
      const newElement = elementsMap[element.id];
      if (newElement) {
        newValue.push(merge(element, newElement));
        idToRemove.push(element.id);
      }
    });
    const newElements: POLY_API.Element[] = Object.values(omit(idToRemove, elementsMap));
    this.next([...newValue, ...newElements]);
    isSave && savePolyApiResult();
  }

  getElementsValue(): POLY_API.PlainElement[] {
    return this.value.map((element): POLY_API.PlainElement => {
      const { data, ...elementWithoutData } = element;
      return { ...elementWithoutData, data: data?.value };
    });
  }
}

export default PolyCanvasStore;
