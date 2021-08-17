import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

type Callback = <T>(state: T) => any;

const useCallbackState = <T extends unknown>(props?: T)
  : [T | undefined, (state: T, cb: Callback) => any] => {
  const [state, setState] = useState(props);
  const callbackList = useRef<Callback[]>([]);

  useEffect(() => {
    callbackList.current.forEach((callback) => callback(state));
    callbackList.current = [];
  }, [state]);

  const setCallbackState = useCallback((newProps, callback: Callback) => {
    setState(newProps);
    callback && callbackList.current.push(callback);
  }, [setState]);

  return [state, setCallbackState];
};

export default useCallbackState;
