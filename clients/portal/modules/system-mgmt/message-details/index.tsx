import React, { forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { MsgType } from '@portal/modules/system-mgmt/constants';
import { getMsgById } from '@portal/modules/system-mgmt/api';
import Loading from '@c/loading';

import Container from '../container';
import FileList from '../send-message/filelist';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const MessageDetails = () => {
  return (
    <Container
      hideInfoCard
      asModalPage
      className='flex-col flex-1'
      pageName='消息详情'
      style={{
        height: 'calc(100vh - 62px)',
      }}
    >
      <Content />
    </Container>
  );
};

interface ContentWithoutProps {
isPreview?: boolean;
canDownload?: boolean;
canMultiDownload?: boolean;
}

function ContentWithoutRef({
}: ContentWithoutProps, ref: React.Ref<unknown> | undefined) {
  const param : { id: string} = useParams();

  const { data: msgDetail, isLoading } = useQuery(
    'GET_MSG_BY_ID',
    () => getMsgById(param.id),
    { refetchOnWindowFocus: false }
  );

  if (isLoading && !msgDetail) {
    return <Loading desc="数据加载中..." />;
  }

  const { recivers = [] }: any = msgDetail;

  let txt = '';
  if (msgDetail?.sort === MsgType.notify) {
    txt = '通知公告';
  } else if (msgDetail?.sort === MsgType.system) {
    txt = '系统消息';
  } else {
    txt = '未知消息类型';
  }

  return (
    <div
      className="w-full overflow-hidden"
      style={{ height: 'calc(100% - 24px)' }}
    >
      <div className="relative w-full mt-16 rounded-12 bg-white h-full">
        <Header>
          <div className="title">发送消息</div>
        </Header>
        <div
          className='w-full m-auto px-52 overflow-auto'
          style={{ height: 'calc(100% - 56px)' }}
        >
          <div className='pt-48'>
            <div className='mb-24 font-semibold text-20 leading-28 text-gray-900'>
              {msgDetail?.title}
            </div>
            <div dangerouslySetInnerHTML={{ __html: msgDetail?.content as any }} />
            <FileList
              candownload={true}
              files={(msgDetail?.mes_attachment || [])}
              hideProgress
              isPreview={true}
              canMultiDownload={true}
              messageTitle={msgDetail?.title}
            />
          </div>
          <div className='pb-48'>
            <ul >
              <li>发送时间: <span>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span></li>
              <li>操作人: <span>{msgDetail?.handle_name}</span></li>
              <li>消息类型: <span>{txt}</span></li>
              <li>
                发送结果:
                <span>
                  共 {msgDetail?.send_num}人，发送失败 {msgDetail?.fail} 人，发送成功 {msgDetail?.send_num} 人
                </span>
              </li>
              <li>发送范围:
                <span>
                  {recivers?.type}
                  {recivers && recivers.map((reciver: { id: string; type: 1 | 2; name: string }) => (<Person
                    className={`${reciver.type === 2 ? 'isDep' : 'isPerson'} `}
                    key={reciver.id}
                  >
                    <span>{reciver.name}</span>
                  </Person>))
                  }
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>);
}
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  height: 56px;
  min-height: 56px;
  border-bottom: 1px solid #E2E8F0;
  position: relative;
  background: white;
  background-image: url(/dist/images/md-header-bg.jpg);
  background-position: top right;
  background-size: contain;
  background-repeat: no-repeat;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

   .title {
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 24px;
      color: #0F172A;
      margin-right: 16px;
    }
`;
const Person = styled.span`
    display: inline-flex;
    align-items: center;
    background: #F0F6FF;
    border-radius: 4px 0px;
    padding: 2px 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #375FF3;
    margin-right: 8px;
    margin-bottom: 8px;
    &.isDep {
      color: #D97706;
      background: #FFFBEB;
    }
    &.isPerson {
  
    }

`;
export const Content = forwardRef(ContentWithoutRef);

export default MessageDetails;
