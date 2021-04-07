import React, { useState, useRef } from 'react';

import Card from '@c/card';
import { Checkbox } from '@c/checkbox';
import { countBy, searchByKey, deepClone } from '@lib/utils';
import { IRoleFunc, IRoleFuncItem } from '../api';

export interface IAlterRoleFunc {
  funcs: IRoleFunc;
  tag: string;
  lastSaveTime?: number;
  id: string | number;
}

export default function AlterRoleFunc({ funcs: functions }: IAlterRoleFunc) {
  // @ts-ignore
  const [funcs, setFuncs] = useState<IRoleFunc>(deepClone(functions));
  const total = countBy<IRoleFunc, boolean>('has', 'child', (v) => v, funcs);
  // const [addSets, setAddSets] = useState<string[]>([]);
  // const [deleteSets, setDeleteSets] = useState<string[]>([]);
  const originTags = useRef<string[]>([]);

  const getFuncIds = (func: IRoleFunc | IRoleFuncItem): string[] => {
    const tags = [];
    for (const key in func) {
      if (key === 'id' && func.has) {
        tags.push(func.id as string);
        // @ts-ignore
      } else if (key !== 'id' && typeof func[key] === 'object') {
        // @ts-ignore
        tags.push(...getFuncIds(func[key]));
      }
    }
    return tags;
  };
  if (!originTags.current.length) {
    originTags.current = getFuncIds(functions);
  }

  // useEffect(() => {
  // const allSets = getFuncIds(funcs);
  // const adds = allSets.filter((item) => !originTags.current.includes(item));
  // const deletes = originTags.current.filter((item) => !allSets.includes(item));
  // setAddSets(adds);
  // setDeleteSets(deletes);
  // }, [funcs]);

  const updateFuncs = (funcTag: string) => (e: Event, checked: boolean) => {
    setFuncs((s: IRoleFunc) => {
      const newS = { ...s };
      const data = searchByKey<string, IRoleFunc, IRoleFuncItem>('funcTag', funcTag, newS);
      if (data) {
        data.has = checked;
        return newS;
      }
      return s;
    });
  };

  // const selectAll = (func: IRoleFuncItem) => () => {
  //   const ev = new Event('click');
  //   const needSelect = !isAllChildSelected(func);
  //   needSelect && updateFuncs(func.funcTag)(ev, needSelect);
  //   Object.values(func.child).forEach((i) => {
  //     updateFuncs(i.funcTag)(ev, needSelect);
  //     if (i.child) {
  //       selectAll(i);
  //     }
  //   });
  // };

  // const isAllChildSelected = (func: IRoleFuncItem) => {
  //   return Object.values(func.child).every((i) => i.has);
  // };

  const renderFuncCard = (funcs: IRoleFunc) => {
    return (
      <>
        {Object.values(funcs).map((func) => {
          if (!func.child) {
            return (
              <Checkbox
                disabled
                checked={func.has}
                className="mr-72 flex flex-row items-center text-caption mb-16"
                key={func.funcTag}
                value={func.funcTag}
                onChange={updateFuncs(func.funcTag)}
              >
                {func.name}
              </Checkbox>
            );
          }

          return (
            <Card
              style={{ backgroundColor: '#fff' }}
              key={func.funcTag}
              headerClassName="py-16 px-20 border-b border-gray-200"
              title={
                (<Checkbox
                  disabled
                  checked={func.has}
                  value={func.funcTag}
                  onChange={updateFuncs(func.funcTag)}
                >
                  {func.name}
                </Checkbox>)
              }
              itemTitleClassName="text-h5"
              // action={
              //   <span onClick={selectAll(func)}>
              //     {func.child && !isSuper
              //       ? `${isAllChildSelected(func) ? '反选' : '全选'}${
              //           Object.keys(func.child).length
              //         }项`
              //       : ''}
              //   </span>
              // }
              headerActionClassName="no-underline text-gray-400
              text-12 leading-4 cursor-pointer"
              content={<>{renderFuncCard(func.child)}</>}
              contentClassName="py-16 pb-0 px-20 flex justify-start whitespace-nowrap flex-wrap"
            />
          );
        })}
      </>
    );
  };

  // const getSaveTime = (time: number) => {
  //   const date = new Date(time * 1000);
  //   const month = `${date.getMonth() + 1}`.padStart(2, '0');
  //   const d = `${date.getDate()}`.padStart(2, '0');
  //   const hour = `${date.getHours()}`.padStart(2, '0');
  //   const minutes = `${date.getMinutes()}`.padStart(2, '0');
  //   return `${date.getFullYear()}-${month}-${d} ${hour}:${minutes}`;
  // };

  // const saveRoleFunctions = () => {
  //   let params = [];
  //   if (deleteSets.length) {
  //     params = ['setRoleFunctions', id, addSets, deleteSets];
  //   } else {
  //     params = ['setRoleFunctions', id, addSets];
  //   }
  //   setRoleFunctions({
  //     queryKey: params,
  //   }).then(({ code }) => {
  //     if (code == 0) {
  //       setAddSets([]);
  //       setDeleteSets([]);
  //       Message.success('保存成功');
  //     }
  //   });
  // };

  return (
    <div className="overflow-scroll h-full">
      <header className="mx-4 flex flex-row items-center justify-between py-3">
        <Checkbox disabled checked={!!total}>
          已开启 {total} 项
        </Checkbox>
        {/* {!isSuper && (
          <div className="flex flex-row items-center justify-between">
            {!!lastSaveTime && (
              <span className="text-12 text-gray-400 mr-8">
                最近保存时间：{getSaveTime(lastSaveTime)}
              </span>
            )}
            <Button
              className="bg-gray-700 hover:bg-gray-900 transition"
              textClassName="text-white ml-2"
              icon={<img src="/dist/images/save.svg" />}
              onClick={saveRoleFunctions}
            >
              保存
            </Button>
          </div>
        )} */}
      </header>
      {renderFuncCard(funcs)}
    </div>
  );
}
