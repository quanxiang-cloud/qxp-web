import useObservable from '@lib/hooks/use-observable';

import store, { updateStore } from '@flowEditor/store';
import type { StoreValue } from '@flowEditor/type';

export default function useNodeSwitch(): (id: string) => void {
  const { errors } = useObservable<StoreValue>(store);

  function activeNodeForm(id: string): void {
    updateStore((s) => ({
      ...s,
      nodeIdForDrawerForm: id,
      errors: {
        ...s.errors,
        dataNotSaveMap: new Map(),
      },
    }));
  }

  return (id: string) => {
    const entries = [...errors?.dataNotSaveMap.entries() ?? []];
    const hasNotSaveNode = entries.find(([nodeID, needSave]) => {
      if (nodeID !== id && needSave) {
        return true;
      }
    });
    if (hasNotSaveNode) {
      return updateStore((s) => ({
        ...s,
        showDataNotSaveConfirm: true,
        currentDataNotSaveConfirmCallback: () => activeNodeForm(id),
      }));
    }
    activeNodeForm(id);
  };
}
