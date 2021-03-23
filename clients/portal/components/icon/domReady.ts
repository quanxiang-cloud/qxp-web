const ieContentLoaded = (callback: any) => {
  const d = document;
  let done = false;
  const init = () => {
    if (!done) {
      done = true;
      callback();
    }
  };
  const polling = () => {
    try {
      d.documentElement.scrollTo({
        left: 10,
        top: 20,
      });
    } catch (e) {
      setTimeout(polling, 50);
      return;
    }
    init();
  };
  polling();
  d.onreadystatechange = () => {
    if (d.readyState === 'complete') {
      d.onreadystatechange = null;
      init();
    }
  };
};

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
