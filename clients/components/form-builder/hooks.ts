import { useState } from 'react';

export function useFormPreview(initialValue: boolean) {
  return useState(initialValue);
}

export function useLinkageSetting(initialValue: boolean) {
  return useState(initialValue);
}

export function useDataSetting(initialValue: boolean) {
  return useState(initialValue);
}

export function useCanvasFormValue(initialValue: any) {
  return useState(initialValue);
}
