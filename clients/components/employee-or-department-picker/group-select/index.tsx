import React, { useMemo, useEffect } from 'react';
import { observer } from 'mobx-react';

import EmptyTips from '@c/empty-tips';
import Loading from '@c/loading';
import CheckboxGroup, { CheckboxOptionType } from '@c/checkbox/checkbox-group';

import OwnerStore from '../store';
import { GroupType } from './store';

type Props = {
  ownerStore: OwnerStore;
};

function GroupSelect({ ownerStore }: Props): JSX.Element {
  const groupStore = ownerStore.groupStore;

  const groups: GroupType[] = useMemo(() => {
    return [
      { id: 'group_1', name: '分组1' },
      { id: 'group_2', name: '分组2' },
      { id: 'group_3', name: '分组3' },
    ];
  }, []);

  const options: CheckboxOptionType[] = useMemo(() => {
    if (!groups) return [];

    return groups.map(({ id, name }) => ({
      id,
      value: id,
      label: name,
    }));
  }, [groups]);

  useEffect(() => {
    if (!groups) return;
    groupStore.initialSelectedKeys(groups, ownerStore.owners);
  }, [groups, ownerStore.owners]);

  function handleChange(ids: string[]): void {
    if (ids.length > groupStore.selectedKeys.length) {
      ids.filter((id) => !groupStore.selectedKeys.includes(id)).forEach((id) => {
        if (!groups) {
          return;
        }
        const group = groups.find((group) => group.id === id);
        if (!group) {
          return;
        }
        ownerStore.addOwner({
          type: 3,
          ownerID: group.id,
          ownerName: '',
          phone: '',
          email: '',
          departmentName: '',
          createdAt: -1,
          id: group.id,
          departmentID: '',
          groupName: group.name,
        });
      });
    } else if (ids.length < groupStore.selectedKeys.length) {
      groupStore.selectedKeys.filter((key) => !ids.includes(key)).forEach((id) => {
        ownerStore.removeOwner(id);
      });
    }
  }

  if (!groups) {
    return <Loading />;
  }

  if (!groups.length) {
    return <EmptyTips text="没有可选分组" />;
  }

  return (
    <div className='overflow-y-auto' style={{ maxHeight: 350 }}>
      <CheckboxGroup
        style={{ alignItems: 'flex-start' }}
        className="flex flex-col"
        value={groupStore.selectedKeys}
        options={options}
        onChange={(values) => handleChange(values as string[])}
      />
    </div>
  );
}

export default observer(GroupSelect);
