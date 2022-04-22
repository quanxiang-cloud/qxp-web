export function applyStyle(url: string, shadowRoot: ShadowRoot): void {
  const styleID = 'shadow-custom-css';
  let link = shadowRoot.getElementById(styleID);
  if (link) {
    shadowRoot.removeChild(link);
  }
  link = document.createElement('link');
  link.setAttribute('id', styleID);
  link.setAttribute('type', 'text/css');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', url);
  link.onload = () => {};
  shadowRoot.prepend(link);
}
