import { useCallback } from 'react';

import { isSomeActionShow } from '@portal/modules/poly-api/utils';

export default function useCanvasClick(): () => void {
  const handleCanvasClick = useCallback(() => {
    const flowNodes = Array.from(document.querySelectorAll('.react-flow__node')) as HTMLElement[];
    const nodeActivedList = flowNodes
      .map((node: HTMLElement) => isSomeActionShow(node) ? node : false)
      .filter(Boolean) as HTMLElement[];
    nodeActivedList.forEach((node) => node.style.zIndex = '10');
  }, []);

  return handleCanvasClick;
}
