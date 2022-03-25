import React from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';

import Icon from '@c/icon';
import Card from '@c/card';

import { CardInfo } from '../types.d';

type Props = {
  cardList?: CardInfo[];
}

function ViewRelated({ cardList }: Props): JSX.Element {
  const history = useHistory();
  const { appID } = useParams<{ appID: string }>();
  // const [cardList, setCardList] = useState<CardInfo[]>([]);

  function goLink(cardID: string, id?: string): void {
    if (cardID === 'linkedFlows') {
      if (id) {
        history.push(`/apps/flow/${appID}/${id}`);
        return;
      }
      history.push(`/apps/details/${appID}/setting_flow`);
      return;
    }

    if (cardID === 'AuthorizedRoles') {
      if (id) {
        history.push(`/apps/details/${appID}/app_control?id=${id}`);
        return;
      }
      history.push(`/apps/details/${appID}/app_control`);
    }
    return;
  }

  return (
    <div className='rounded-12 flex select-none py-16'>
      {cardList?.map(({ title, list, id: cardID }) => {
        return (
          <Card
            key={title}
            className="border-1 card-box mr-16"
            headerClassName="p-16"
            title={(
              <div className="flex items-center text-h6">
                <Icon name="link" size={20} />
                <span className="mx-8">{title}</span>
                <span className="text-gray-400">{`(${list.length})`}</span>
              </div>
            )}
            action={(
              <Icon
                name="arrow_forward"
                size={20}
                className="anchor-focus"
                onClick={() => goLink(cardID)}
              />
            )}
            itemTitleClassName="text-h5"
            contentClassName="p-0 flex-col"
            content={(
              <div className="mb-24 h-80 overflow-auto">
                {list.length ? list.map(({ name, id, status }) => {
                  const statusColor = status === 'ENABLE' ? 'green' : 'yellow';

                  return (
                    <div
                      key={name}
                      className={cs('px-4 py-8 link-focus truncate flex items-center', {
                        'px-44': !status,
                      })}
                      onClick={() => goLink(cardID, id)}
                    >
                      {status && (
                        <div
                          style={{
                            '--status-color': `var(--${statusColor}-600)`,
                            '--status-shadow-color': `var(--${statusColor}-400)`,
                            boxShadow: `0 0 12px var(--${statusColor}-400)`,
                          } as React.CSSProperties}
                          className="relative w-8 h-8 rounded-full ml-40"
                        >
                          <div className="status-dot"></div>
                        </div>
                      )}
                      <div className="truncate flex-1">
                        <span className={status && 'ml-10'}>{name}</span>
                        <span className="ml-4 text-gray-400">
                          {status && (status === 'ENABLE' ? '(已发布)' : '(草稿)')}
                        </span>
                      </div>
                    </div>
                  );
                }) : <div className="px-44 py-8 text-gray-400">！暂无数据</div>}
              </div>
            )}
          />
        );
      })}
    </div>
  );
}

export default observer(ViewRelated);
