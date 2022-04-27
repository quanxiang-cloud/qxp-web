import React, { useEffect } from 'react';
import { Select } from '@one-for-all/ui';

import { Package } from '@pageDesign/blocks/menu/type';

import { packages } from './store';

interface Props {
  current?: Package;
  onChange: (pkg: Package) => void;
}

const PackageSelector = ({ current, onChange }: Props): JSX.Element => {
  function getDefaultValue(): Package {
    return packages[0];
  }

  useEffect(() => {
    packages.length && !current && onChange(getDefaultValue());
  }, [packages, current]);

  const options = packages.map(({ label, name }) => ({
    label,
    value: name,
  }));

  const packageMap = packages.reduce((acc: Record<string, Package>, cur) => {
    acc[cur.name] = cur;
    return acc;
  }, {});

  return (
    <div onClick={(e) => e.stopPropagation()} className="mb-10 flex-shrink-0">
      <Select
        options={options}
        value={current?.name}
        onChange={(url) => onChange(packageMap[url])}
      />
    </div>
  );
};

export default PackageSelector;
