import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-query';
import { noop } from 'lodash';

import toast from '@lib/toast';
import { SaveWorkFlowParamsType, saveWorkFlow } from '@newFlow/api';

type Noop = typeof noop;

export default function useSave(appID: string, id?: string): (
  data: SaveWorkFlowParamsType,
  onOk?: Noop,
  onError?: Noop
) => void {
  const history = useHistory();
  const callback = useRef<{ onOk?: Noop; onError?: Noop }>();
  const saveMutation = useMutation(saveWorkFlow, {
    onSuccess: (respData: any) => {
      toast.success('保存成功');
      callback.current?.onOk?.();
      if (appID && respData?.name && !id) {
        history.replace(`/apps/flow/${appID}/${respData?.name}`);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
      callback.current?.onError?.();
    },
  });

  function onSaveWorkFlow(data: SaveWorkFlowParamsType, onOk?: Noop, onError?: Noop): void {
    callback.current = {
      onOk, onError,
    };
    const saveData: SaveWorkFlowParamsType = data;
    if (id) {
      saveData.id = id;
    }
    saveMutation.mutate(saveData);
  }

  return onSaveWorkFlow;
}
