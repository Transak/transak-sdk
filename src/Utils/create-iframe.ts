export function createIframe(src: string) {
  const iframe = document.createElement('iframe');

  Object.assign(iframe, {
    id: 'transakIframe',
    allow: 'camera;microphone;payment',
    src,
  });

  return iframe;
}
