import {
  useStore,
  useZoomPanHelper,
} from 'react-flow-renderer';

// todo fix this, assign to lishengma
type FunctionToBeRefactor = () => void;

export default function useFitView(callback?: FunctionToBeRefactor) {
  const flowStore = useStore();
  const { setCenter, fitView } = useZoomPanHelper();

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
      fitView({ padding: 0.5 });
    }
    callback && callback();
  }

  return focus;
}
