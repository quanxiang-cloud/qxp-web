import { useEffect, useState } from 'react';
import { StyleDataItem } from './class-selector';
import { designTokenData } from './constant';

export function useStyleData(): [ boolean, StyleDataItem[] ] {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [styleData, setStyleData] = useState<StyleDataItem[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const data = designTokenData.map((style) => {
      const name = `${style.name.replace(/\./g, '-')}`;
      const _value: any = style.value;
      const type = style.type;
      const unit: any = style.unit;
      let value: any;
      if (type === 'typography') {
        value = Object.assign({}, _value);
        const unitKeys = Object.keys(unit);
        const valueKeys = Object.keys(_value).filter((key) => unitKeys.includes(key));
        valueKeys.forEach((key) => {
          value[key] = value[key] + unit[key];
        });
      } else {
        value = { [type]: _value + (unit || '') };
      }
      return { name, value, type };
    });
    setTimeout(() => {
      setStyleData(data);
      setIsLoading(false);
    }, 100 );
  }, []);

  return [isLoading, styleData];
}
