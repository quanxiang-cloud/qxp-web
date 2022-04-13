import { or, prop } from 'ramda';
import {
  FitViewParams,
  useStoreState,
  useZoomPanHelper,
  Node,
} from 'react-flow-renderer';

export default function useFitView(fitViewParams?: FitViewParams): () => void {
  const { setCenter, fitView, zoomTo } = useZoomPanHelper();
  const nodes = useStoreState(prop('nodes'));

  function notNodeEmptyOrNoWrapper(nodes: Node[], el: HTMLElement | null): el is HTMLElement {
    return !or(!nodes.length, !el);
  }

  function focus(): void {
    const el = document.querySelector<HTMLElement>('.reactflow-wrapper');
    if (notNodeEmptyOrNoWrapper(nodes, el)) {
      const x = el.offsetWidth / 2;
      const y = el.offsetHeight / 2;
      setCenter(x, y, 1.0);
      fitView({ ...fitViewParams, padding: 0.5 });
      zoomTo(1);
    }
  }

  return focus;
}
