import { BehaviorSubject } from 'rxjs';
import { lensPath, set, dissocPath, path } from 'ramda';

import { nanoid } from '@c/form-builder/utils';
import { insertToArray } from '@polyApi/utils/object-editor';

export class ItemStore<T extends { children: T[] }> extends BehaviorSubject<T> {
  parent$?: Store<T> | ItemStore<T>;
  children$: ItemStore<T>[]
  isChildrenHidden = false;
  isHidden = false;
  id = nanoid();

  constructor(initialValue: T, parent?: ItemStore<T> | Store<T>) {
    super(initialValue);
    this.parent$ = parent;
    this.children$ = this.value.children.map((child) => new ItemStore(child, this));
  }

  set(key: string, value: any): void {
    this.next(set(lensPath(key.split('.')), value, this.value));
  }

  get<T>(key: string): T {
    return path(key.split('.'), this.value) as T;
  }

  unset(key: string): void {
    this.next(dissocPath(key.split('.'), this.value));
  }

  hide(): void {
    this.isHidden = true;
    this.hideChildren();
  }

  show(): void {
    this.isHidden = false;
  }

  hideChildren(): void {
    this.children$.forEach((child) => child.hide());
    this.isChildrenHidden = true;
  }

  showChidren(): void {
    this.children$.forEach((child) => child.show());
    this.isChildrenHidden = false;
  }

  removeChild(child?: ItemStore<T>): void {
    if (!child) {
      this.children$ = [];
      this.value.children = [];
    } else {
      this.children$ = this.children$.filter((c) => c !== child);
      this.value.children = this.value.children.filter((c) => c !== child.value);
    }
    this.reOrder();
  }

  update(): void {
    this.next({ ...this.value });
  }

  reOrder(): void {
    this.children$.forEach((c, index) => {
      c.set('index', index);
    });
    this.value.children.forEach((c, index) => {
      Object.assign(c, { index });
    });
    this.update();
  }

  addChild(child: T, position: number): void {
    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }
    const newChild = new ItemStore(child, this);
    if (this.isChildrenHidden) {
      newChild.hide();
    }
    this.children$ = insertToArray(this.children$, position, newChild);
    this.value.children = insertToArray(this.value.children, position, child);
    this.reOrder();
  }
}

export class Store<T extends { children: T[] }> extends BehaviorSubject<ItemStore<T>[]> {
  constructor(initialValue: ItemStore<T>[]) {
    super(initialValue);
  }

  set(key: string, value: any): void {
    this.next(set(lensPath(key.split('.')), value, this.value));
  }

  get<T>(key: string): T {
    return path(key.split('.'), this.value) as T;
  }

  unset(key: string): void {
    this.next(dissocPath(key.split('.'), this.value));
  }

  update(): void {
    this.next([...this.value]);
  }

  removeChild(child: ItemStore<T>): void {
    const newValue = this.value.filter((c) => c !== child);
    this.next(this.reOrder(newValue));
  }

  reOrder(children: ItemStore<T>[]): ItemStore<T>[] {
    return children.map((c, index) => {
      c.set('index', index);
      return c;
    });
  }

  addChild(child: T, position: number): void {
    if (typeof position !== 'number') {
      throw new Error('Position must be a number');
    }
    const newValue = insertToArray<ItemStore<T>>(this.value, position, new ItemStore(child));
    this.next(this.reOrder(newValue));
  }
}

export function createStore<T extends { children: T[] }>(initialValue: T[]): Store<T> {
  const itemStores = initialValue.map((value) => new ItemStore<T>(value));
  const store = new Store(itemStores);
  itemStores.forEach((itemStore) => itemStore.parent$ = store);
  return store;
}
