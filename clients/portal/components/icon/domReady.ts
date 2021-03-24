const DOMReady = (fn: any) => {
  if (document.addEventListener) {
    if (
      ['complete', 'loaded', 'interactive'].indexOf(document.readyState) > -1
    ) {
      setTimeout(fn, 0);
    } else {
      const loadFn = () => {
        document.removeEventListener('DOMContentLoaded', loadFn, false);
        fn();
      };
      document.addEventListener('DOMContentLoaded', loadFn, false);
    }
  }
};

export default DOMReady;
