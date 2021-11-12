import { BehaviorSubject } from 'rxjs';
import { lensPath, set, dissocPath, path } from 'ramda';

export interface ObjectSchema {
  type: 'number' | 'string' | 'boolean' | 'object' | 'array';
  name: string | null;
  index: number | null;
  parentPath: string | null;
  required: boolean;
  desc: string;
  children: ObjectSchema[];
}

export class ItemStore extends BehaviorSubject<ObjectSchema> {
  parent$?: Store | ItemStore;
  children$: ItemStore[];

  constructor(initialValue: ObjectSchema, parent?: ItemStore | Store) {
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
}

export class Store extends BehaviorSubject<ItemStore[]> {
  constructor(initialValue: ItemStore[]) {
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

export function createStore(initialValue: ObjectSchema[]): Store {
  return new Store(initialValue.map((value) => new ItemStore(value)));
}
