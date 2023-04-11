import { SharedStatesSpec, Artery } from '@one-for-all/artery';

export function mapShareState(states: Record<string, string>): SharedStatesSpec {
  return Object.entries(states)?.reduce((memo: Record<string, any>, [k, v]: [string, string]) => {
    const parsedVal: { val: any, desc?: string } = JSON.parse(v);
    memo[k] = { initial: JSON.parse(parsedVal.val), desc: parsedVal.desc || '' };
    return memo;
  }, {});
}

export function mapSharedStateSpec(artery: Artery): Record<string, any> {
  return Object.entries(artery.sharedStatesSpec || {})?.reduce(
    (acc: Record<string, any>, [k, v]: [string, any]) => {
      const conf = {
        name: k,
        val: JSON.stringify(v.initial),
        desc: v.desc || '',
      };
      acc[k] = JSON.stringify(conf);
      return acc;
    },
    {},
  );
}

export function mapApiStateSpec(artery: Artery): Record<string, any> {
  return Object.entries(artery.apiStateSpec || {})?.reduce(
    (acc: Record<string, any>, [k, v]: [string, any]) => {
      acc[k] = v;
      return acc;
    },
    {},
  );
}
