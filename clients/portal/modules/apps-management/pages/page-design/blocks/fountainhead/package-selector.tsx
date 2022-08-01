import React, { useContext, useEffect } from 'react';
import { Select } from '@one-for-all/ui';

import type { Package } from '@pageDesign/blocks/fountainhead/type';
import Loading from '@c/loading';

import FountainContext from '../../fountain-context';

interface Props {
  current?: Package;
  onChange: (pkg: Package) => void;
}

const PackageSelector = ({ current, onChange }: Props): JSX.Element => {
  const { packages } = useContext(FountainContext);

  useEffect(() => {
    const defaultValue = packages?.[0];
    defaultValue && !current && onChange(defaultValue);
  }, [packages, current]);

  const options = packages?.filter(({ hide }) => !hide)?.map(({ label, name }) => ({ label, value: name }));

  const packageMap = packages?.reduce((acc: Record<string, Package>, cur) => {
    acc[cur.name] = cur;
    return acc;
  }, {});

  if (!packageMap || !options) {
    return <Loading desc="loading..." />;
  }

  return (
    <div onClick={(e) => e.stopPropagation()} className="mb-10 flex-shrink-0">
      <Select options={options} value={current?.name} onChange={(url) => onChange(packageMap[url])} />
    </div>
  );
};

export default PackageSelector;
