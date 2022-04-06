export function applyStyle(css: string, shadowRoot: ShadowRoot): void {
  const styleID = 'shadow-custom-css';
  const style = shadowRoot.getElementById(styleID) || document.createElement('style');
  style.innerHTML = '';
  style.setAttribute('id', styleID);
  style.appendChild(document.createTextNode(css));
  shadowRoot.appendChild(style);
}
