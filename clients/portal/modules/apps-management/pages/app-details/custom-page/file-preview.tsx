import React, { useEffect, useState, forwardRef } from 'react';
import Frame from 'react-frame-component';
import Loading from '@c/loading';

interface Props {
  className?: string;
  indexUrl: string;
}

function FilePreview({ indexUrl }: Props, ref: React.Ref<any>): JSX.Element {
  const [indexCont, setIndexCont] = useState<string>('');
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    fetch(indexUrl)
      .then((resp) => resp.text())
      .then((cont) => {
        setIndexCont(cont);
      });
  }, []);

  const renderLoading = () => {
    if (!indexCont || !contentLoaded) {
      return <Loading />;
    }
  };

  return (
    <div>
      {renderLoading()}
      <Frame
        initialContent={indexCont || '<!DOCTYPE html><html><head></head><body><div></div></body></html>'}
        style={{ width: '100%', height: '100%', border: 'none' }}
        contentDidMount={() => setContentLoaded(true)}
      >
      </Frame>
    </div>
  );
}

export default forwardRef(FilePreview);
