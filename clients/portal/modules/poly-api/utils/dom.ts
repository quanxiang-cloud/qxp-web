export function getElementWidth(element?: HTMLElement | null): number {
  return element?.getBoundingClientRect().width ?? 0;
}

export function getElementHeight(element?: HTMLElement | null): number {
  return element?.getBoundingClientRect().height ?? 0;
}
