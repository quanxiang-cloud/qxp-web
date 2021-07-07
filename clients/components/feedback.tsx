import React from 'react';

import Icon from '@c/icon';

const feedbackPagePath = '/apps/07be4956-33d2-4bd2-b78b-3822a470f5cb?pageID=22194A14ABDA44E1B49531EECCFDB023';

export default function FeedbackBtn(): JSX.Element {
  return (
    <a
      className="btn"
      target="_blank"
      rel="noreferrer"
      href={`//${window.CONFIG.home_hostname}${feedbackPagePath}`}
    >
      <Icon name="feedback" className="mr-4" size={20} />
      反馈意见
    </a>
  );
}
