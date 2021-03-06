import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';

import * as headlessUI from '@one-for-all/headless-ui';

import PreviewItem from './preview-item';

import store from '../store';

function ShadowContent({
  shadowDomRef,
  children,
}: { children: JSX.Element[], shadowDomRef: React.RefObject<HTMLDivElement> }): JSX.Element | null {
  useEffect(() => {
    if (!shadowDomRef.current || store.shadowRoot) {
      return;
    }

    store.shadowRoot = shadowDomRef.current.attachShadow({ mode: 'open' });
  }, [store.currentComp]);

  useEffect(() => {
    if (!store.shadowRoot) {
      return;
    }

    const style = document.createElement('style');
    style.textContent = `
    .style-guide-comp-item {
     cursor: pointer;
     border: 1px solid transparent;
     padding:5px;
     display:flex;
     gap:5px;
     align-items: center;
    }

    .style-guide-comp-item:hover, .style-guide-comp-item-active {
      border: 1px solid var(--blue-500);
    }`;
    store.shadowRoot.appendChild(style);
  }, [store.shadowRoot]);

  if (!store.shadowRoot) {
    return null;
  }

  return ReactDOM.createPortal(children, store.shadowRoot as unknown as Element);
}

const ShadowContentObservable = observer(ShadowContent);

function PreviewConfigurableComponent(): JSX.Element {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      store.shadowRoot = null;
    };
  }, []);

  if (!store.currentComp) {
    return <div />;
  }

  const { key } = store.currentComp;
  console.log(headlessUI);
  const Component = (headlessUI as any)[key];

  if (!Component) {
    return <div />;
  }

  const curCompKey = `${store.currentCompStatus?.key}.${store.currentCompStatus?.spec.title}`;

  return (
    <div ref={previewRef} className='gird'>
      <ShadowContentObservable shadowDomRef={previewRef}>
        {
          store.currentComp.specs.map((spec) => (
            <PreviewItem
              key={spec.title}
              isActive={curCompKey === `${key}.${spec.title}`}
              compSpec={spec}
              onClick={() => store.setCurrentCompStatus(key, spec)}
              Component={Component}
            />
          ))
        }
      </ShadowContentObservable>
    </div >
  );
}

export default observer(PreviewConfigurableComponent);
