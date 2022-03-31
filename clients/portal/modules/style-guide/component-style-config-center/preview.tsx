import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';

import * as headlessUI from '@one-for-all/headless-ui';

import store from '../store';

function ShadowContent({ shadowRoot, children }: { children: JSX.Element[], shadowRoot: ShadowRoot }): JSX.Element {
  useEffect(() => {
    const style = document.createElement('style');
    const compStyle = document.createElement('link');
    compStyle.href = 'https://ofapkg.pek3b.qingstor.com/@one-for-all/headless-ui@0.1.1/ofa-headless-ui-web.css';
    compStyle.rel = 'stylesheet';
    style.textContent = `
    .style-guide-comp-item {
     cursor: pointer;
     border: 1px solid transparent;
     padding:5px;
     display:flex;
     gap:5px;
     align-items: center;
    }

    .style-guide-comp-item:hover {
      border: 1px solid var(--blue-500);
    }`;
    shadowRoot.appendChild(compStyle);
    shadowRoot.appendChild(style);
  }, []);

  return ReactDOM.createPortal(children, shadowRoot as unknown as Element);
}

function PreviewConfigurableComponent(): JSX.Element {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current || store.shadowRoot) {
      return;
    }

    store.shadowRoot = previewRef.current?.attachShadow({ mode: 'open' });
  }, [previewRef.current, store.currentComp]);

  useEffect(() => {
    return () => {
      store.shadowRoot = null;
    };
  }, []);

  if (!store.currentComp) {
    return <div />;
  }

  const { key } = store.currentComp;
  const Component = (headlessUI as any)[key];

  if (!Component) {
    return <div />;
  }

  return (
    <div ref={previewRef} className='gird'>
      {store.shadowRoot && (
        <ShadowContent shadowRoot={store.shadowRoot}>
          {
            store.currentComp.specs.map((spec) => {
              return (
                <div style={{ padding: '5px 0' }} key={spec.title}>
                  <div style={{ marginBottom: '5px' }}>{spec.title}</div>
                  <div
                    onClick={() => store.setCurrentCompStatus(key, spec)}
                    className='style-guide-comp-item'
                  >
                    {Array.isArray(spec.componentProps) ? spec.componentProps.map((props) => (
                      <Component key={JSON.stringify(props)} {...props} />
                    )) : (<Component {...spec.componentProps} />)}
                  </div>
                </div>
              );
            })
          }
        </ShadowContent>
      )}
    </div >
  );
}

export default observer(PreviewConfigurableComponent);
