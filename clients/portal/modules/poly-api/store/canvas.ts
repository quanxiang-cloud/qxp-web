import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators';
import { pipe, entries, fromPairs } from 'lodash/fp';
import { lensPath, set, dissocPath, or, path } from 'ramda';

interface SingleNodeState {
  isHovered: boolean;
  isSelected: boolean;
  zIndex: '3' | '10',
  trigger: {
    right: {
      isHovered: boolean;
      isVisible: boolean;
      action: {
        isHoverd: boolean;
        isVisible: boolean;
      }
    },
    bottom: {
      isHovered: boolean;
      isVisible: boolean;
      action: {
        isHoverd: boolean;
        isVisible: boolean;
      }
    },
  }
}

interface State {
  [nodeId: string]: SingleNodeState | undefined;
}

const defaultValue: SingleNodeState = {
  isHovered: false,
  isSelected: false,
  zIndex: '3',
  trigger: {
    right: {
      isHovered: false,
      isVisible: false,
      action: {
        isHoverd: false,
        isVisible: false,
      },
    },
    bottom: {
      isHovered: false,
      isVisible: false,
      action: {
        isHoverd: false,
        isVisible: false,
      },
    },
  },
};

const originalStore$ = new BehaviorSubject<State>({});

const valueProcessor = pipe(
  entries,
  ([key, value]: [string, SingleNodeState]) => {
    const isActionVisible = or(
      path(['trigger', 'right', 'action', 'isVisible'], value),
      path(['trigger', 'bottom', 'action', 'isVisible'], value),
    );
    set(lensPath(['zIndex']), value?.isHovered || value?.isSelected || isActionVisible ? '10' : '3', value);
    set(lensPath(['trigger', 'right', 'isVisible']), value?.isHovered, value);
    set(lensPath(['trigger', 'bottom', 'isVisible']), value?.isHovered, value);
    return value ? [key, value] : [];
  },
  fromPairs,
);

export const store$ = originalStore$.pipe(
  map((value) => ({
    add: (id: string) => {
      if (value?.[id]) {
        return;
      }
      originalStore$.next({ ...value, [id]: { ...defaultValue } });
    },
    set: (path: string, val: any) => originalStore$.next(set(lensPath(path.split('.')), val, value)),
    remove: (path: string) => originalStore$.next(dissocPath(path.split('.'), value)),
    value: (() => {
      return valueProcessor(value);
    })(),
  })),
);

