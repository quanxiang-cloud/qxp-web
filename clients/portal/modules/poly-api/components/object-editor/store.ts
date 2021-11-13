import { BehaviorSubject } from 'rxjs';
import { lensPath, set, dissocPath, path } from 'ramda';

export class ItemStore<T extends { children: T[] }> extends BehaviorSubject<T> {
  parent$?: Store<T> | ItemStore<T>;
  children$: ItemStore<T>[]
  isChildrenHidden = false;
  isHidden = false;

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
    this.showChidren();
  }

  hideChildren(): void {
    this.children$.forEach((child) => child.hide());
    this.isChildrenHidden = true;
  }

  showChidren(): void {
    this.children$.forEach((child) => child.show());
    this.isChildrenHidden = false;
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
}

export function createStore<T extends { children: T[] }>(initialValue: T[]): Store<T> {
  return new Store(initialValue.map((value) => new ItemStore<T>(value)));
}
