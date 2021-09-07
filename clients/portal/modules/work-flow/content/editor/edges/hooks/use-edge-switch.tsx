import useObservable from '@lib/hooks/use-observable';

import store, { updateStore } from '@flow/content/editor/store';
import type { StoreValue, CurrentConnection } from '@flow/content/editor/type';

export default function useNodeSwitch(): (id: string, currentConnection: CurrentConnection) => void {
  const { errors } = useObservable<StoreValue>(store);

  function activeComponentSelectorForm(currentConnection: CurrentConnection): void {
    updateStore((s) => ({
      ...s,
      currentConnection,
      nodeIdForDrawerForm: 'components',
      errors: {
        ...s.errors,
        dataNotSaveMap: new Map(),
      },
    }));
  }

  return (id: string, currentConnection: CurrentConnection) => {
    const entries = [...errors?.dataNotSaveMap.entries() ?? []];
    const hasNotSaveNode = entries.find(([nodeID, needSave]) => {
      if (nodeID !== id) {
        return needSave;
      }
    });
    if (hasNotSaveNode) {
      return updateStore((s) => ({
        ...s,
        showDataNotSaveConfirm: true,
        currentDataNotSaveConfirmCallback: () => activeComponentSelectorForm(currentConnection),
      }));
    }
    activeComponentSelectorForm(currentConnection);
  };
}
