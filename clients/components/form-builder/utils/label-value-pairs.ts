import { SetStateAction, useEffect, useMemo, useState } from 'react';

export const CUSTOM_OTHER_VALUE = 'CUSTOM_OTHER_VALUE';

export function usePairValue(joinedPair?: string): string | undefined {
  return useMemo(() => {
    if (!joinedPair) {
      return;
    }

    const labelValuePair: string[] = joinedPair.split(':');
    // compatible with old version radio component
    if (labelValuePair.length === 1) {
      return labelValuePair[0];
    }

    return labelValuePair.pop();
  }, [joinedPair]);
}

export function usePairLabel(enums: LabelValue[], joinedPair?: string): string | undefined {
  return useMemo(() => {
    if (!joinedPair) {
      return;
    }

    const labelValuePair: string[] = joinedPair.split(':');

    // compatible with old version component
    if (labelValuePair.length === 1) {
      return enums.find(({ value }: LabelValue) => {
        return value === labelValuePair[0];
      })?.label;
    }

    return labelValuePair.slice(0, -1).join('');
  }, [joinedPair, enums]);
}

export function usePairListValue(joinedPairs?: string[]): string[] {
  return useMemo(() => {
    if (!joinedPairs) {
      return [];
    }

    return joinedPairs.map((pair) => pair.split(':')).map((pair) => {
      // compatible with old version radio component
      if (pair.length < 2) {
        return pair[0] as string;
      }

      return pair.pop() as string;
    });
  }, [joinedPairs]);
}

export function usePairListLabel(enums: LabelValue[], joinedPairs?: string[]): string[] {
  return useMemo(() => {
    if (!joinedPairs) {
      return [];
    }

    return joinedPairs.map((pair) => pair.split(':')).map((pair) => {
      // compatible with old version radio component
      if (pair.length < 2) {
        return enums.find(({ value }) => value === pair[0])?.label || pair[0];
      }

      return pair.slice(0, -1).join('');
    });
  }, [joinedPairs, enums]);
}

export function useCustomOtherValue(joinedPair?: string): [string, React.Dispatch<SetStateAction<string>>] {
  const [otherValue, setOtherValue] = useState('');
  useEffect(() => {
    if (!joinedPair) {
      return;
    }

    const labelValuePair = joinedPair.split(':');
    if (labelValuePair.length < 2) {
      return;
    }

    if (labelValuePair.pop() === CUSTOM_OTHER_VALUE) {
      setOtherValue(labelValuePair.join(''));
    }
  }, []);

  return [otherValue, setOtherValue];
}
