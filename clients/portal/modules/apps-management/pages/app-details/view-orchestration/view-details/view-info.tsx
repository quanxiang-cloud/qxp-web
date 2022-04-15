import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Tab from '@c/tab';
import Icon from '@c/icon';
import Button from '@c/button';

import ArteryRenderer from '@c/artery-renderer';
import { DefaultFormDescriptions } from '../constants';
import { getArteryPageInfo } from '@lib/http-client';
import { mapToArteryPageDescription } from '../../utils';
import { toast } from '@one-for-all/ui';

import appStore from '../../store';

import { ExternalView, SchemaView, TableSchemaView, View, ViewType } from '../types.d';
import { ARTERY_VERSION } from '@portal/constants';

type Props = {
  view: View;
  openModal: (type: string) => void;
}

type View_Map = {
  icon: string;
  viewType: string;
  operator: string;
}

type ViewDescription = {
  id: string;
  title: string;
  value: string;
}

const VIEW_MAP: Record<ViewType, View_Map> = {
  table_schema_view: {
    icon: 'schema-form',
    viewType: '表单页面',
    operator: '设计表单',
  },
  static_view: {
    icon: 'custom-page',
    viewType: '静态页面',
    operator: '修改页面',
  },
  schema_view: {
    icon: 'view',
    viewType: '自定义页面',
    operator: '设计页面',
  },
  external_view: {
    icon: 'view',
    viewType: '外部链接页面',
    operator: '修改页面',
  },
};

function realizeLink(view: ExternalView): string {
  const { link = '', appID = '' } = view;
  const replacements: Record<string, string> = {
    user_id: window.USER.id,
    user_name: window.USER.name,
    user_email: window.USER.email,
    user_phone: window.USER.phone,
    dep_id: window.USER.deps[0][0].id,
    dep_name: window.USER.deps[0][0].name,
    appid: appID,
  };

  let _link = link;
  Object.keys(replacements).forEach((key) => {
    _link = _link.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), replacements?.[key]);
  });
  return _link;
}

function ViewInfo({ view, openModal }: Props): JSX.Element {
  const { type } = view;
  const history = useHistory();
  const { appID } = useParams<{ appID: string }>();
  const [formDescriptions, setFormDescriptions] = useState<ViewDescription[]>();

  const Preview = useMemo((): JSX.Element | null => (
    <div className='h-full pointer-events-none'>
      {
        type === ViewType.StaticView && (
          <iframe
            className="w-full h-full"
            src={view.fileUrl}
            style={{ border: 'none' }}
          />
        ) }

      {
        type === ViewType.ExternalView && (
          <iframe
            className="w-full h-full"
            src={realizeLink(view)}
            style={{ border: 'none' }}
          />
        )
      }
      {
        type === ViewType.SchemaView && (
          <ArteryRenderer
            arteryID={view.arteryID}
            version={ARTERY_VERSION}
          />
        )
      }
    </div>
  )
  , [view]);

  useEffect(() => {
    if (view.type === ViewType.TableSchemaView) {
      setFormDescriptions(DefaultFormDescriptions),
      getArteryPageInfo(appID, view.tableID).then((res) => {
        setFormDescriptions( (prevDescriptions) => prevDescriptions?.map((description) => {
          return mapToArteryPageDescription(description, res);
        }));
      }).catch(() => {
        toast.error('表单信息获取失败');
      });
      return;
    }
    setFormDescriptions([{ id: 'type', title: '页面类型', value: VIEW_MAP[type].viewType }]);
  }, [view.id]);

  function goPageDesign(): void {
    const arteryID = (view as SchemaView).arteryID;
    history.push(`/artery-engine?appID=${appID}&pageName=${view.name}&arteryID=${arteryID}`);
  }

  function goFormBuild(): void {
    history.push(`/apps/formDesign/formBuild/${(view as TableSchemaView).tableID}/${appID}?pageName=${view.name}`);
  }

  function handleBtnClick(): void {
    if (type === ViewType.StaticView) {
      return openModal('editStaticView');
    }

    if (type === ViewType.SchemaView) {
      return goPageDesign();
    }

    if (type === ViewType.ExternalView) {
      return openModal('editView');
    }

    goFormBuild();
  }

  return (
    <div className='relative flex flex-col flex-1 overflow-hidden p-16'>
      <div className='px-16 py-8 rounded-8 border-1 flex items-center'>
        <div className="page-details-icon">
          <Icon
            size={24}
            type="dark"
            name={VIEW_MAP[type].icon}
          />
        </div>
        <div className='flex-1 grid grid-cols-6 mr-48'>
          {formDescriptions?.map(({ title, value }) => {
            return (
              <div key={title}>
                <p className={!value ? 'text-gray-400' : ''}>{value ? value : '-'}</p>
                <p className='page-details-text'>{title}</p>
              </div>
            );
          })}
        </div>
        <Button
          iconName='edit'
          className="mr-18"
          modifier='primary'
          textClassName='app-content--op_btn'
          onClick={handleBtnClick}
        >
          {VIEW_MAP[type].operator}
        </Button>
        <Button
          iconName='article'
          className="mr-18"
          modifier='primary'
          textClassName='app-content--op_btn'
          forbidden={appStore.appDetails.useStatus !== 1}
          onClick={() => {
            window.open(`/_jump_to_home?to=${view.url}`);
          }}
        >
          访问页面
        </Button>
      </div>
      {[ViewType.SchemaView, ViewType.StaticView, ViewType.ExternalView].includes(type) && (
        <Tab
          className='flex-1'
          contentClassName='flex-1'
          items={[
            {
              id: 'page-preview',
              name: '页面预览',
              content: Preview,
            },
          ]}
        />
      )}
    </div>
  );
}

export default observer(ViewInfo);
