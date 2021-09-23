import React from 'react';

interface Props {
    validating: boolean,
    tips: string,
}

export default function ValidatingTips({ validating, tips } : Props): JSX.Element {
  return (
    <>
      {validating && (
        <div className="text-caption-no-color text-red-600 mt-8">
          {tips}
        </div>
      )}
    </>
  );
}
