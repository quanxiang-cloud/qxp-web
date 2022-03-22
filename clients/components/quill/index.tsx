import React, { useRef, useEffect, useImperativeHandle, useState } from 'react';
import type { Quill } from 'quill';

import logger from '@lib/logger';

import OPTIONS from './options';

export type { Quill };

const quillSrc = 'https://ofapkg.pek3b.qingstor.com/@one-for-all/quill@1.3.6/index.min.js';
const styleSrc = 'https://ofapkg.pek3b.qingstor.com/@one-for-all/quill@1.3.6/1.3.6-quill.snow.css';

function loadQuill(): Promise<Quill | null> {
  return System.import(styleSrc).then((module) => {
    const styleSheet = module.default;
    // @ts-ignore
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];

    return System.import(quillSrc);
  }).then((module) => {
    return module.default as unknown as Quill;
  }).catch((err) => {
    logger.error(err);
    return null;
  });
}

type Props = {
  initialValue: string;
}

function QuillEditor({ initialValue }: Props, ref: React.Ref<Quill | null>): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useImperativeHandle(ref, () => {
    return quillRef.current;
  }, [loaded]);

  useEffect(() => {
    let isUnmounting = false;

    loadQuill().then((quillClass) => {
      if (!quillClass || isUnmounting) {
        return;
      }

      const quill = new (quillClass as any)(containerRef.current, OPTIONS);
      quill.setContents(quill.clipboard.convert(initialValue));
      quillRef.current = quill;
      setLoaded(true);
    });

    return () => {
      isUnmounting = true;
    };
  }, []);

  return (<div ref={containerRef} style={{ height: 350 }} />);
}

export default React.forwardRef<Quill | null, Props>(QuillEditor);
