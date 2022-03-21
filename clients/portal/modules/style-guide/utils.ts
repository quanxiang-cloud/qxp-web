export function applyStyle(compKey: string, css: string, shadowRoot: ShadowRoot): void {
  const styleID = `custom-css-${compKey}`;
  const style = shadowRoot.getElementById(styleID) || document.createElement('style');
  style.innerHTML = '';
  style.setAttribute('id', styleID);
  style.appendChild(document.createTextNode(css));
  shadowRoot.appendChild(style);
}
