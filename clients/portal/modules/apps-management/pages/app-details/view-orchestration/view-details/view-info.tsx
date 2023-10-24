import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { toast } from '@one-for-all/ui';

import Tab from '@c/tab';
import Icon from '@c/icon';
import Button from '@c/button';
import ArteryRenderer from '@c/artery-renderer';
import { realizeLink } from '@lib/utils';
import { getArteryPageInfo } from '@lib/http-client';
import { ARTERY_KEY_VERSION } from '@portal/constants';

import appStore from '../../store';
import { DefaultFormDescriptions } from '../constants';
import { mapToArteryPageDescription } from '../../utils';
import { SchemaView, TableSchemaView, View, ViewType } from '../types.d';

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
        )}

      {
        type === ViewType.ExternalView && (
          <iframe
            className="w-full h-full"
            src={realizeLink(view.appID, view.link)}
            style={{ border: 'none' }}
          />
        )
      }
      {
        type === ViewType.SchemaView && (
          <ArteryRenderer
            // force rerender when arteryID change
            key={view.arteryID}
            arteryID={view.arteryID}
            version={ARTERY_KEY_VERSION}
          />
        )
      }
    </div>
  ), [view]);

  useEffect(() => {
    let isUnmounted = false;
    if (view.type === ViewType.TableSchemaView) {
      setFormDescriptions(DefaultFormDescriptions);
      getArteryPageInfo(appID, view.tableID).then((res) => {
        !isUnmounted && setFormDescriptions((prevDescriptions) => prevDescriptions?.map((description) => {
          return mapToArteryPageDescription(description, res);
        }));
      }).catch(() => {
        toast.error('表单信息获取失败');
      });
      return;
    }
    setFormDescriptions([{ id: 'type', title: '页面类型', value: VIEW_MAP[type].viewType }]);
    return () => {
      isUnmounted = true;
    };
  }, [view.id]);

  function goPageDesign(): void {
    const arteryID = (view as SchemaView).arteryID;
    history.push(`/artery-engine?appID=${appID}&pageName=${view.name}&arteryID=${arteryID}`);
  }

  function goFormBuild(): void {
    history.push(`/apps/formDesign/formBuild/${(view as TableSchemaView).tableID}/${appID}?pageName=${view.name}&jump_to_home=${view.url}`);
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
              <div
                key={title}
                className='flex flex-col justify-between'
              >
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
