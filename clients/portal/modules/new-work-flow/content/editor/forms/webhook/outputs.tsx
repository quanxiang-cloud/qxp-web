import React, { Fragment, useRef, useEffect, useMemo } from 'react';

import Icon from '@c/icon';
import { Input } from '@newFlow/content/editor/type';

import { flattenOutputs } from './utils';

interface Props {
  value: Input[];
  parentElement?: HTMLDivElement;
}

export default function Outputs({ value, parentElement }: Props): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<SVGSVGElement | null>(null);
  const isOpenRef = useRef<boolean>(false);
  const outputs = flattenOutputs(value);

  const observer = useMemo(() => new ResizeObserver(([{ contentRect }]) => {
    const { height } = contentRect;
    const isOpen = height > 38;
    isOpen && triggerRef.current?.classList.add('rotate-180');
    !isOpen && triggerRef.current?.classList.remove('rotate-180');
    isOpenRef.current = isOpen;
  }), [triggerRef.current]);

  useEffect(() => {
    const el = parentElement ?? sectionRef.current;
    if (!el) {
      return;
    }
    el.style.height = '38px';
    if (parentElement && sectionRef.current) {
      sectionRef.current.style.height = `${sectionRef.current.scrollHeight + 20}px`;
    }
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [parentElement, sectionRef.current, observer]);

  function handleCollapse(): void {
    const el = parentElement ?? sectionRef.current;
    const isOpen = isOpenRef.current;
    if (!el) {
      return;
    }
    el.style.height = `${isOpen ? '38px' : `${el.scrollHeight + 20}px`}`;
    isOpen && triggerRef.current?.classList.add('rotate-180');
    !isOpen && triggerRef.current?.classList.remove('rotate-180');
    isOpenRef.current = !isOpen;
  }

  const headerStyle = {
    backgroundColor: '#F8FAFC',
  };
  const headerClassName = 'p-8 text-caption-no-color-weight text-gray-600 outputs-header';
  const bodyClassName = 'p-8 text-caption-no-color-weight text-gray-900 outputs-body';

  return (
    <section ref={sectionRef}>
      <header className="py-8 flex items-center justify-between">
        <p className="text-h6-bold text-gray-600">返回参数</p>
        <Icon
          ref={triggerRef}
          name="caret-down"
          size={16}
          clickable
          onClick={handleCollapse}
          className="transform rotate-180 transition-all duration-240"
        />
      </header>
      <article className="grid grid-cols-3 rounded-8 overflow-hidden border">
        <div className={headerClassName} style={headerStyle}>参数名</div>
        <div className={headerClassName} style={headerStyle}>类型</div>
        <div className={headerClassName} style={headerStyle}>描述</div>
        {outputs.map((item, index) => {
          return (
            <Fragment key={index}>
              <div className={bodyClassName} style={{ paddingLeft: item.level * 10 }}>{item.name}</div>
              <div className={bodyClassName}>{item.type}</div>
              <div className={bodyClassName}>{item.desc || '-'}</div>
            </Fragment>
          );
        })}
      </article>
    </section>
  );
}
