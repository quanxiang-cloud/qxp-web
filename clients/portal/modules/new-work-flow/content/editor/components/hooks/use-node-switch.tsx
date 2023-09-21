import useObservable from '@lib/hooks/use-observable';

import store, { updateStore, toggleNodeForm } from '@newFlow/content/editor/store';
import type { StoreValue } from '@newFlow/content/editor/type';

export default function useNodeSwitch(): (id: string, fillInPersons?: any) => void {
  const { errors, readonly } = useObservable<StoreValue>(store);

  return (id: string, fillInPersons?: any) => {
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
    toggleNodeForm(id, fillInPersons);
  };
}
