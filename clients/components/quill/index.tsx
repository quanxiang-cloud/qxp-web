import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import type { QuillOptionsStatic, Quill } from 'quill';

import logger from '@lib/logger';

export { Quill };

const theme = 'snow';
const quillSrc = 'https://ofapkg.pek3b.qingstor.com/@one-for-all/quill@1.3.6/index.min.js';
const styleSrc = 'https://ofapkg.pek3b.qingstor.com/@one-for-all/quill@1.3.6/1.3.6-quill.snow.css';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }],

    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],

    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    // ['link', 'image', 'video'],
    ['link', 'video'],
    [{ color: [] }, { background: [] }],

    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'bold', 'italic', 'underline', 'strike', 'align', 'list', 'indent',
  'size', 'header', 'link', 'image', 'video', 'color', 'background', 'clean',
];

const OPTIONS: QuillOptionsStatic = { modules, formats, theme };

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

    loadQuill().then((module) => {
      if (module && !isUnmounting) {
        const quill = new (module as any)(containerRef.current, OPTIONS);
        quill.setContents(quill.clipboard.convert(initialValue));
        quillRef.current = quill;
        setLoaded(true);
      }
    });

    return () => {
      isUnmounting = true;
    };
  }, []);

  return (<div ref={containerRef} style={{ height: 350 }} />);
}

export default forwardRef<Quill | null, Props>(QuillEditor);
