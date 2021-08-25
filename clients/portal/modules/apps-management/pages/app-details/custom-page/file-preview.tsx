import React, { useEffect, useState, forwardRef } from 'react';
import Frame from 'react-frame-component';
import Loading from '@c/loading';

interface Props {
  className?: string;
  indexUrl: string;
}

const framePlaceholder = (body?: string) => `<!DOCTYPE html><html><head></head><body><div>${body || ''}</div></body></html>`;

function FilePreview({ indexUrl }: Props, ref: React.Ref<any>): JSX.Element {
  const [indexCont, setIndexCont] = useState<string>('');
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    fetch(indexUrl)
      .then((resp) => resp.text())
      .then((cont) => {
        if (cont && cont.indexOf('{') !== 0) {
          // exclude json str
          setIndexCont(cont);
        } else {
          setIndexCont(framePlaceholder(cont));
        }
      });
  }, []);

  const renderLoading = () => {
    if (!indexCont || !contentLoaded) {
      return <Loading />;
    }
  };

  return (
    <div className="w-full h-full">
      {renderLoading()}
      <Frame
        initialContent={indexCont || framePlaceholder()}
        style={{ width: '100%', height: '100%', border: 'none' }}
        contentDidMount={() => setContentLoaded(true)}
      >
      </Frame>
    </div>
  );
}

export default forwardRef(FilePreview);
