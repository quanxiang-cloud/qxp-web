import { BehaviorSubject } from 'rxjs';
import { lensPath, set, dissocPath, path } from 'ramda';

export class PolyNodeStore extends BehaviorSubject<POLY_API.PolyNode> {
  constructor(initialValue: POLY_API.PolyNode) {
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
}

export default PolyNodeStore;
