import { configure, action, observable, computed } from 'mobx';

import APINamespaceTreeStore from './namespace';

configure({
  enforceActions: 'never',
});

export class OrchestrationAPIStore {
  @observable
  appID: string;

  @observable
  isApiNameSpaceDetailsLoading = false;

  @observable
  public namespaceStore?: APINamespaceTreeStore;

  constructor(appID: string) {
    this.appID = appID;
  }

  @action
  public setNameSpaceStore(store?: APINamespaceTreeStore): void {
    this.namespaceStore = store;
  }

  @action
  updateProperty(value: Partial<OrchestrationAPIStore>): void {
    Object.assign(this, value);
  }

  @computed
  get currentNamespacePath(): string {
    return this.namespaceStore?.currentFocusedNode.path;
  }

  @computed
  get currentNamespaceName(): string {
    return this.namespaceStore?.currentFocusedNode.name;
  }
}

export default function orchestrationAPIStoreFactory(appID: string): OrchestrationAPIStore {
  const orchestrationAPIStore = new OrchestrationAPIStore(appID);
  return orchestrationAPIStore;
}
