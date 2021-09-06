import useObservable from '@lib/hooks/use-observable';

import store, { updateStore, toggleNodeForm } from '@flow/content/editor/store';
import type { StoreValue } from '@flow/content/editor/type';

export default function useNodeSwitch(): (id: string) => void {
  const { errors, readonly } = useObservable<StoreValue>(store);

  return (id: string) => {
    if (readonly) {
      return;
    }
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
        currentDataNotSaveConfirmCallback: () => toggleNodeForm(id),
      }));
    }
    toggleNodeForm(id);
  };
}
