import { BehaviorSubject } from 'rxjs';
import { lensPath, set, dissocPath, path } from 'ramda';

import { insertToArray } from '@polyApi/utils/object-editor';

export class ItemStore<T extends { children: T[], id: string }> extends BehaviorSubject<T> {
  parent$?: Store<T> | ItemStore<T>;
  children$: ItemStore<T>[]
  isChildrenHidden = false;
  isHidden = false;

  get id(): string {
    return this.value.id;
  }

  get Value(): T {
    return { ...this.value, children: this.children$.map((c) => c.Value) };
  }

  constructor(initialValue: T, parent?: ItemStore<T> | Store<T>) {
    super(initialValue);
    this.parent$ = parent;
    this.children$ = initialValue.children.map((child) => new ItemStore(child, this));
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

  showChildren(): void {
    this.children$.forEach((child) => child.show());
    this.isChildrenHidden = false;
  }

  removeChild(child?: ItemStore<T>): void {
    this.children$ = !child ? [] : this.children$.filter((c) => c !== child);
    this.reOrder();
  }

  update(): void {
    this.next({ ...this.value });
  }

  reOrder(): void {
    this.children$.forEach((c, index) => {
      c.set('index', index);
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
    this.reOrder();
  }
}

export class Store<T extends { children: T[]; id: string }> extends BehaviorSubject<ItemStore<T>[]> {
  constructor(initialValue: ItemStore<T>[]) {
    super(initialValue);
  }

  get Value(): ItemStore<T>[] {
    return this.value;
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
    const itemStore = new ItemStore(child);
    itemStore.parent$ = this;
    const newValue = insertToArray<ItemStore<T>>(this.value, position, itemStore);
    this.next(this.reOrder(newValue));
  }

  setChildren(childes: T[]): void {
    const oldChildMap: Record<string, ItemStore<T>> = this.value.reduce(
      (acc, c) => ({ ...acc, [c.id]: c }), {},
    );
    const itemStores = childes.map((child) => {
      const oldStore = oldChildMap[child.id];
      if (oldStore) {
        oldStore.next(child);
        return oldStore;
      }
      const itemStore = new ItemStore<T>(child);
      itemStore.parent$ = this;
      return itemStore;
    });
    this.next(itemStores);
  }
}

export function createStore<T extends { children: T[]; id: string }>(initialValue: T[]): Store<T> {
  const itemStores = initialValue.map((value) => new ItemStore<T>(value));
  const store = new Store(itemStores);
  itemStores.forEach((itemStore) => itemStore.parent$ = store);
  return store;
}
