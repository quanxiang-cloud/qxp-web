import { useCallback, useRef, useEffect, RefObject } from 'react';
import { and, mergeRight } from 'ramda';
import type { BlockItemProps } from '@one-for-all/artery-engine';

import type { BlocksCommunicationType } from '@pageDesign/types';
import { useClickOutSide } from '@pageDesign/hooks/use-click-outside';

export interface UseMenuPanelResult {
  panelWidth?: number;
  currentType?: string;
  pinned?: boolean;
  onPin: () => void;
  onClose: () => void;
  onForceClose: () => void;
  ref: RefObject<HTMLDivElement>;
  onSharedStateChange: (path: string, value: any) => void;
  get visible(): boolean;
}

interface Props extends BlockItemProps<BlocksCommunicationType> { type: string; }

export function useMenuPanel(props: Props): UseMenuPanelResult {
  const ref = useRef<HTMLDivElement>(null);
  const { sharedState, onSharedStateChange, onUpdateBlock, onUpdateLayer, type } = props;
  const { menu = {}, block } = sharedState;
  const { currentType, pinned, panelWidth } = menu;
  const isVisible = useRef(false);
  isVisible.current = currentType === type;

  useEffect(() => {
    const visible = isVisible.current;
    const shouldShowStatic = visible && pinned;
    onUpdateBlock({
      layerId: 'root',
      blockId: `static-${type}`,
      name: 'hide',
      value: !shouldShowStatic,
    });
    if (!visible) {
      return;
    }

    onUpdateBlock({
      layerId: 'root',
      blockId: 'static-header',
      name: 'style',
      value: {
        gridColumnStart: `span ${shouldShowStatic ? 4 : 3}`,
      },
    });
    onUpdateLayer({
      layerId: 'root',
      name: 'style',
      value: { gridTemplateColumns: `56px ${shouldShowStatic ? 'auto' : ''} 1fr 282px` },
    });
  }, [pinned, currentType]);

  const closePanel = useCallback(() => {
    onSharedStateChange('menu', mergeRight(menu, { currentType: '', pinned: false }));
  }, [onSharedStateChange, menu]);

  const onClose = useCallback((): void => {
    !pinned && closePanel();
  }, [closePanel, pinned]);

  const onForceClose = useCallback((): void => {
    closePanel();
    onUpdateBlock({
      layerId: 'root',
      blockId: 'static-header',
      name: 'style',
      value: {
        gridColumnStart: 'span 3',
      },
    });
    onUpdateLayer({
      layerId: 'root',
      name: 'style',
      value: { gridTemplateColumns: '56px 1fr 282px' },
    });
  }, [closePanel, onUpdateBlock, onUpdateLayer]);

  useClickOutSide({
    callback: onClose,
    when: (target): boolean => {
      const whiteListSet = block[type]?.clickOutsideWhiteList ?? new Set();
      const whiteList = [...whiteListSet];
      return and(
        isVisible.current,
        and(!pinned, !whiteList.some((el) => el.contains(target))),
      );
    },
    container: ref,
  });

  function onPin(): void {
    onSharedStateChange('menu.pinned', !pinned);
  }

  return {
    onPin,
    onClose,
    panelWidth,
    ref,
    currentType,
    onSharedStateChange,
    pinned,
    onForceClose,
    get visible(): boolean {
      return isVisible.current;
    },
  };
}
