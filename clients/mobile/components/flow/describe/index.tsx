import React from 'react';
import cs from 'classnames';

import { DescribeModel } from '@m/pages/approvals/detail/status/utils';
import { Props } from '@m/qxp-ui-mobile';
import Icon from '@m/qxp-ui-mobile/icon';
import Link from '@m/qxp-ui-mobile/link';

import './index.scss';

export interface DescribeProps extends Props {
  describes: DescribeModel[];
}

export default function Describe(props: DescribeProps): JSX.Element {
  return (
    <>
      {props.describes.map((item, index) => {
        return (
          <div key={index} className={cs('describe-wrapper body2 text-secondary', props.className)}>

            {!!item.userName && (
              <div className='describe-item-wrapper'>
                <Icon name='person' size='.16rem'/>
                <div className='describe-text ml-4 truncate'>
                  {item.userName}
                </div>
              </div>
            )}

            {!!item.stepBack && (
              <div className='describe-item-wrapper mt-4'>
                <Icon name='subdirectory_arrow_left' size='.16rem'/>
                <div className='describe-text ml-4 truncate'>
                  {item.stepBack}
                </div>
              </div>
            )}

            {!!item.sendBack && (
              <div className='describe-item-wrapper mt-4'>
                <Icon name='settings_backup_restore' size='.16rem'/>
                <div className='describe-text ml-4 truncate'>
                  {item.sendBack}
                </div>
              </div>
            )}

            {!!item.remark && (
              <div className='describe-item-wrapper mt-4'>
                <Icon name='rate_review' size='.16rem'/>
                <div className='describe-text ml-4 truncate'>
                  {item.remark}
                </div>
              </div>
            )}

            {!!item.attachFiles?.length && (
              <div className='describe-item-wrapper describe-item-text-wrapper mt-4'>
                <div className='icon-attachment flex justify-center items-center'>
                  <Icon name='attachment' size='.16rem' />
                </div>
                <div className='describe-text-wrapper text-highlight ml-4 truncate'>
                  {
                    item.attachFiles.map((attach, index) => {
                      // Todo: Add sign upload url check
                      return (
                        <Link
                          key={index}
                          className='describe-text truncate'
                          target='_blank'
                          href={attach.fileUrl}
                        >
                          {attach.fileName}
                        </Link>
                      );
                    })
                  }
                </div>
              </div>
            )}

          </div>
        );
      })}
    </>
  );
}
