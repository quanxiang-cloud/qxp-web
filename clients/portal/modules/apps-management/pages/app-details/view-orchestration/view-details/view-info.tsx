import React, { useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Tab from '@c/tab';
import Icon from '@c/icon';
import Button from '@c/button';

import { ExternalView, SchemaView, TableSchemaView, View, ViewType } from '../types.d';
import ArteryRenderer from '@c/artery-renderer';
import { VERSION } from '../constants';

type Props = {
  view: View;
  openModal: (type: string) => void;
}

type View_Map = {
  icon: string;
  viewType: string;
  operator: string;
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
  const pageDescriptions = [{ id: 'type', title: '页面类型', value: VIEW_MAP[type].viewType }];

  const Preview = useMemo((): JSX.Element | null => {
    if (type === ViewType.StaticView) {
      return (
        <iframe
          className="w-full h-full"
          src={view.fileUrl}
          style={{ border: 'none' }}
        />
      );
    }

    if (type === ViewType.ExternalView) {
      const link = realizeLink(view);
      return (
        <iframe
          className="w-full h-full"
          src={link}
          style={{ border: 'none' }}
        />
      );
    }

    if (type === ViewType.SchemaView) {
      return (
        <ArteryRenderer
          arteryID={view.arteryID}
          version={VERSION}
        />
      );
    }

    return null;
  }, [view]);

  function goPageDesign(): void {
    // to change below line after page engine v2 new update
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
    <div className='relative h-full flex-1 overflow-hidden p-16'>
      <div className='px-16 py-8 rounded-8 border-1 flex items-center'>
        <div className="page-details-icon">
          <Icon
            size={24}
            type="dark"
            name={VIEW_MAP[type].icon}
          />
        </div>
        <div className='flex-1 grid grid-cols-6 mr-48'>
          {pageDescriptions.map(({ title, value }) => {
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
      </div>
      {[ViewType.SchemaView, ViewType.StaticView, ViewType.ExternalView].includes(type) && (
        <Tab
          contentClassName='h-full'
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

export default ViewInfo;
