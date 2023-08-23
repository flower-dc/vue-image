import { loadImage } from "~/components/ImageCopper/src/utils";

 async function _generateWidthRemoveImage(src: string) {
  const image = await loadImage(src);
  image.style.opacity = '0'
  image.style.position = 'absolute'
  image.style.zIndex = '-1'
  document.body.appendChild(image);
  setTimeout(() => {
    document.body.removeChild(image);
    image.remove()
  });
  return image;
};

function _getImageRect(image: HTMLImageElement) {
  const { clientHeight, clientWidth } = image;
  return {
    height: clientHeight,
    width: clientWidth,
  };
};

export async function getImageRect(src: string) {
  const image = await _generateWidthRemoveImage(src);
  return _getImageRect(image);
};


export function canLoadImage(src: string) {
  const img = new Image()
  img.src = src
  return new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
  })
}