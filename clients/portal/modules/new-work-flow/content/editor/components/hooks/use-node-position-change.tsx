import { useEffect } from 'react';

import { updateElementByKey, updateStore } from '@newFlow/content/editor/store';
import usePrevious from '@lib/hooks/use-previous';

interface Props {
  xPos: number;
  yPos: number;
  id: string;
}

export default function usePositionChange({ xPos, yPos, id }: Props, isDragging: boolean): void {
  const previousDragging = usePrevious(isDragging);
  function saveWorkFlow(): void {
    updateStore((s) => ({ ...s, needSaveFlow: true }));
  }

  useEffect(() => {
    if (previousDragging && !isDragging) {
      console.log('saveWorkFlow previousDragging');
      saveWorkFlow();
    }
  }, [isDragging]);

  useEffect(() => {
    updateElementByKey(id, 'position', () => ({
      x: xPos,
      y: yPos,
    }));
  }, [xPos, yPos]);
}
