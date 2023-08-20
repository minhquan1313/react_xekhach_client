export function preloadImage(url: string, onDone: () => void) {
  const image = new Image();
  image.src = url;

  image.onload = onDone;
}
