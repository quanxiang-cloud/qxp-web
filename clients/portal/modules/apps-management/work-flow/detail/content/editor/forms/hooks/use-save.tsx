import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { SaveWorkFlow, saveWorkFlow } from '@flow/detail/api';
import { useMutation } from 'react-query';

import toast from '@lib/toast';

export default function useSave(appID: string, id?: string) {
  const history = useHistory();
  const callback = useRef<Function>();

  const saveMutation = useMutation(saveWorkFlow, {
    onSuccess: (respData) => {
      toast.success('保存成功');
      if (appID && respData?.id && !id) {
        history.replace(`/apps/flow/${appID}/${respData?.id}`);
      } else {
        callback.current?.();
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  function onSaveWorkFlow(data: SaveWorkFlow, onOk: Function) {
    callback.current = onOk;
    const saveData: SaveWorkFlow = data;
    if (id) {
      saveData.id = id;
    }
    saveMutation.mutate(saveData);
  }

  return onSaveWorkFlow;
}
