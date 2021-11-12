import React, { useContext, useEffect } from 'react';
import { setValidationLanguage } from '@formily/antd';
import { observer } from 'mobx-react';

import DragDrop from '../components/drag-drop';
import FieldRender from '../components/field-render';
import { StoreContext } from '../context';
import CanvasContext from '../canvas-context';
import useHasFields from './use-fields';

setValidationLanguage('zh');

function Canvas(): JSX.Element {
  const store = useContext(StoreContext);
  const hasFields = useHasFields(store?.schema);

  function isInViewPort(element: Element): boolean {
    if (!element) {
      return true;
    }
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    const COMP_MAX_HEIGHT_BUFFER = 192;
    const {
      top,
      right,
      bottom,
      left,
    } = element.getBoundingClientRect();

    return (
      top >= 0 &&
      left >= 0 &&
      right <= viewWidth &&
      bottom <= viewHeight - COMP_MAX_HEIGHT_BUFFER
    );
  }

  // usage

  function autoScroll(id: string): void {
    if (!id) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const activedNode = document.querySelector(`[data-id="${id}"]`)!;
    const { top: activedNodeTop } = activedNode?.getBoundingClientRect() || {} as DOMRect;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const canvas: Element = document.querySelector('.canvas-wrapper')!;
    if (isInViewPort(activedNode)) {
      return;
    }
    const { top: canvasTop } = canvas.getBoundingClientRect() as DOMRect;
    canvas.scroll({
      top: canvas.scrollTop + activedNodeTop - canvasTop,
      left: 0,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    autoScroll(store.activeFieldId);
  }, [store.activeFieldId]);

  if (hasFields) {
    return (
      <CanvasContext.Provider value={{ isInCanvas: true }}>
        <DragDrop id='root'>
          <div className="form-builder-canvas">
            <FieldRender schema={{ ...store.schema }} />
          </div>
        </DragDrop>
      </CanvasContext.Provider >
    );
  }

  return (
    <div className="form-builder-bg">
      <DragDrop id='root'>
        <div className="empty-form-builder-canvas" />
      </DragDrop>
    </div>
  );
}

export default observer(Canvas);
