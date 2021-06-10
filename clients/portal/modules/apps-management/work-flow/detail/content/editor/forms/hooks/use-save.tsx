import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { SaveWorkFlow, saveWorkFlow } from '@flow/detail/api';
import { useMutation } from 'react-query';

import toast from '@lib/toast';

export default function useSave(appID: string, id?: string) {
  const history = useHistory();
  const callback = useRef<{onOk: Function; onError?: Function}>();

  const saveMutation = useMutation(saveWorkFlow, {
    onSuccess: (respData) => {
      toast.success('保存成功');
      if (appID && respData?.id && !id) {
        history.replace(`/apps/flow/${appID}/${respData?.id}`);
      } else {
        callback.current?.onOk?.();
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
      callback.current?.onError?.();
    },
  });

  function onSaveWorkFlow(data: SaveWorkFlow, onOk: Function, onError?: Function) {
    callback.current = {
      onOk, onError,
    };
    const saveData: SaveWorkFlow = data;
    if (id) {
      saveData.id = id;
    }
    saveMutation.mutate(saveData);
  }

  return onSaveWorkFlow;
}
