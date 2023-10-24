import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/lib/tree-select';
import { DataNode } from 'rc-tree-select/lib/interface';

import { labelValueRenderer } from '@c/form-data-value-renderer';
import { getUserDepartment } from '@lib/utils';
import { getNoLabelValues } from '@c/form-builder/utils';
import { getERPTree, Organization, getOrganizationDetail } from './messy/api';

import './index.scss';

type Props = TreeSelectProps<any> & {
  appID: string;
  onChange: (value: LabelValue[]) => void;
  optionalRange: 'all' | 'customize' | 'currentUserDep';
  defaultRange: 'customize' | 'currentUserDep',
  defaultValues?: LabelValue[];
  rangeList?: LabelValue[];
  value?: LabelValue[];
  editable?: boolean;
}

type ParseTreeProps = {
  depTreeData?: Organization | undefined;
  initData?: DataNode[];
  rootPId?: string | number;
  fullPath?: string;
}

function parseTree({
  depTreeData,
  initData = [],
  rootPId,
  fullPath,
}: ParseTreeProps): DataNode[] {
  if (!depTreeData) {
    return initData;
  }

  const _fullPath = fullPath ? `${fullPath}/${depTreeData?.id}` : depTreeData?.id;
  initData.push({
    id: depTreeData?.id,
    title: depTreeData?.name,
    pId: depTreeData?.pid || rootPId,
    value: depTreeData?.id,
    fullPath: _fullPath,
  });
  if (depTreeData?.child) {
    depTreeData.child.map((dep) => parseTree({ depTreeData: dep, initData, fullPath: _fullPath }));
  }

  return initData;
}

const OrganizationPicker = ({
  rangeList,
  appID,
  onChange,
  optionalRange,
  defaultRange,
  defaultValues,
  editable = true,
  value = [],
  ...otherProps
}: Props): JSX.Element => {
  useEffect(() => {
    const { id, name } = getUserDepartment(window.USER);
    if (value?.length) {
      return;
    }

    if (defaultRange === 'currentUserDep' || optionalRange === 'currentUserDep') {
      onChange?.([{ label: name, value: id }]);
      return;
    }

    if (defaultValues && defaultValues.length) {
      onChange?.(defaultValues);
    }
  }, []);

  useEffect(() => {
    const noLabelValues = getNoLabelValues(value);

    if (noLabelValues.length) {
      getOrganizationDetail<{ deps: { id: string, name: string }[] }>(noLabelValues).then((res) => {
        const newValue = (value as LabelValue[]).map(({ label, value }) => {
          if (value && !label) {
            const deps = res?.deps || [];
            const curUser = deps.find(({ id }) => id === value);
            return { label: curUser?.name || '', value };
          }

          return { label, value };
        });
        onChange?.(newValue);
      });
    }
  }, []);

  const { data } = useQuery(['query_dep_picker'], () => getERPTree());
  const treeData = React.useMemo(() => {
    const treeDataTmp = parseTree({ depTreeData: data, rootPId: data?.id });
    if (optionalRange === 'customize') {
      if (!rangeList || !rangeList.length) {
        return [];
      }

      const fullPaths: string[] = [];
      const visibleParentNodes: string[] = rangeList?.reduce((acc, { value }) => {
        const nodeTmp = treeDataTmp?.find(({ id }) => id === value);
        if (nodeTmp) {
          fullPaths.push(nodeTmp.fullPath);
          return acc.concat(nodeTmp.fullPath.split('/'));
        }

        return acc;
      }, rangeList.map(({ value }) => value)).filter((id, index, self) => {
        return self.indexOf(id) === index;
      });

      return treeDataTmp.filter(({ id, fullPath }) => {
        if (visibleParentNodes.includes(id) || fullPaths.some((path) => fullPath.startsWith(path))) {
          return true;
        }

        return false;
      });
    }

    if (optionalRange === 'currentUserDep') {
      const { id, name } = getUserDepartment(window.USER);
      const myDep = {
        id,
        fullPath: id,
        pId: 0,
        title: name,
        value: id,
      };
      return [myDep] || [];
    }

    return treeDataTmp;
  }, [data, optionalRange, rangeList, defaultRange]);

  const handleChange = (selected: LabelValue | LabelValue[]): void => {
    if (!selected) {
      onChange([]);
      return;
    }

    onChange(([] as LabelValue[]).concat(selected));
  };

  if (!editable) {
    return (
      <span>
        {
          value && value.length ?
            labelValueRenderer(value) : '—'
        }
      </span>
    );
  }

  const selected = otherProps.multiple ? (value || []) : [...value].shift();

  return (
    <TreeSelect
      {...otherProps}
      allowClear
      labelInValue
      showSearch
      value={selected}
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      className='flex-1 dep-selector'
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeNodeFilterProp="title"
      // treeDataSimpleMode={{
      //   id: 'id',
      //   rootPId: get(treeData, '0.id'),
      // }}
      onChange={handleChange}
      treeData={treeData}
    />
  );
};

export default OrganizationPicker;
