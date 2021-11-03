import notifier from 'node-notifier';

export default function plugin() {
  return {
    // this name will show up in warnings and errors
    name: 'notifier',
    writeBundle: () => {
      notifier.notify('Rollup build finished!');
    },
  };
}
