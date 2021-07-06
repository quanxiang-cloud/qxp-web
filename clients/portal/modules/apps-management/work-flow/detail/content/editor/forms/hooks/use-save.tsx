import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-query';

import toast from '@lib/toast';
import { SaveWorkFlowParamsType, saveWorkFlow } from '@flow/detail/api';

// todo fix this, assign to lishengma
type FunctionToBeRefactor = () => void;

export default function useSave(appID: string, id?: string): (
  data: SaveWorkFlowParamsType,
  onOk?: FunctionToBeRefactor,
  onError?: FunctionToBeRefactor | undefined
) => void {
  const history = useHistory();
  const callback = useRef<{ onOk?: FunctionToBeRefactor; onError?: FunctionToBeRefactor}>();

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

  function onSaveWorkFlow(
    data: SaveWorkFlowParamsType,
    onOk?: FunctionToBeRefactor,
    onError?: FunctionToBeRefactor,
  ): void {
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
