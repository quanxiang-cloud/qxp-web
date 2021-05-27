import {
  useStore,
  useZoomPanHelper,
} from 'react-flow-renderer';

export default function useFitView(callback?: Function) {
  const flowStore = useStore();
  const { setCenter } = useZoomPanHelper();

  function focus() {
    const { nodes } = flowStore.getState();
    if (nodes.length) {
      const el = document.querySelector('.reactflow-wrapper') as HTMLElement;
      if (!el) {
        return;
      }
      const x = el.offsetWidth / 2;
      const y = el.offsetHeight / 2;
      setCenter(x, y, 1.0);
    }
    callback && callback();
  }

  return focus;
}
