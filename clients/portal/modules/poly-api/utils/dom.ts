export function getElementWidth(element: HTMLElement): number {
  return element.getBoundingClientRect().width;
}

export function getElementHeight(element: HTMLElement): number {
  return element.getBoundingClientRect().height;
}
