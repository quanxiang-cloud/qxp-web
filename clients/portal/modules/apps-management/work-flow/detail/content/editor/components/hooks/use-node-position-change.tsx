import { useEffect } from 'react';

import { updateElementByKey } from '@flow/detail/content/editor/store';

interface Props {
  xPos: number;
  yPos: number;
  id: string;
}

export default function usePositionChange({ xPos, yPos, id }: Props) {
  useEffect(() => {
    updateElementByKey(id, 'position', () => ({
      x: xPos,
      y: yPos,
    }));
  }, [xPos, yPos]);
}
