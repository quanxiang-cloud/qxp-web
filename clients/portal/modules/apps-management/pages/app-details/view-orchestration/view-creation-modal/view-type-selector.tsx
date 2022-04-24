import React from 'react';
import cs from 'classnames';

import { ViewType } from '../types.d';

type Props = {
  currentSelectType?: ViewType;
  onSelect?: (type: ViewType) => void;
}

export type ViewTypeItemProps = {
  name: string;
  type: ViewType;
  description: string;
  imgSrc: string;
  imgSrcActive: string;
}

export const VIEW_TYPE_MAP: ViewTypeItemProps[] = [
  {
    name: '表单页面',
    type: ViewType.TableSchemaView,
    description: '表单页通常用来做数据的采集或是单据的填制。',
    imgSrc: '/dist/images/form-dark.svg',
    imgSrcActive: '/dist/images/form-light.svg',
  },
  {
    name: '上传静态页面',
    type: ViewType.StaticView,
    description: '可以上传静态的页面代码，包含html、javascript、css、图片等。',
    imgSrc: '/dist/images/customize-dark.svg',
    imgSrcActive: '/dist/images/customize-light.svg',
  },
  {
    name: '外部链接页面',
    type: ViewType.ExternalView,
    description: '可以通过输入的外部链接、配置的动态参数，作为应用内页面',
    imgSrc: '/dist/images/external-view.svg',
    imgSrcActive: '/dist/images/external-view-active.svg',
  },
  {
    name: '新建自定义页面',
    type: ViewType.SchemaView,
    description: '自定义页通常用做信息展示、门户管理或业务深度定制。',
    imgSrc: '/dist/images/page-dark.svg',
    imgSrcActive: '/dist/images/page-light.svg',
  },
];

function ViewTypeSelector({ onSelect, currentSelectType }: Props): JSX.Element {
  // const [currentType, setCurrentType] = useState<ViewTypeItemProps | undefined>(
  //   VIEW_TYPE_MAP.find((typeItem) => typeItem.type === currentSelectType),
  // );

  return (
    <div className='flex gap-16 p-24'>
      {
        VIEW_TYPE_MAP.map((typeItem) => {
          const active = currentSelectType === typeItem.type;
          return (
            <div
              className='w-230 h-270 border-1 border-gray-200 hover:shadow-more-action cursor-pointer rounded-8 duration-300'
              key={typeItem.type}
              onClick={() => {
                onSelect?.(typeItem.type);
              } }
            >
              <div className='relative w-full'>
                <img
                  className={cs('w-full')}
                  src={typeItem.imgSrc}
                  alt={typeItem.name}
                  draggable={false}
                />
                <img
                  className={cs('w-full duration-300 absolute left-0 top-0',
                    active ? ' opacity-100' : 'opacity-0')
                  }
                  src={typeItem.imgSrcActive}
                  alt={typeItem.name}
                  draggable={false}
                />
              </div>
              <div className='flex flex-col gap-6 text-12 p-16'>
                <span
                  style={active ? { color: 'var(--blue-600)' } : {}}
                  className='text-gray-900 font-semibold'>{typeItem.name}</span>
                <span className='text-gray-600'>{typeItem.description}</span>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

export default ViewTypeSelector;
