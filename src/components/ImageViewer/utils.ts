import { loadImage } from "../ImageCopper/utils";

const _generateWidthRemoveImage = async (src: string) => {
  const image = await loadImage(src);
  document.body.appendChild(image);
  setTimeout(() => {
    document.body.removeChild(image);
  });
  return image;
};

const _getImageRect = (image: HTMLImageElement) => {
  const { clientHeight, clientWidth } = image;
  return {
    height: clientHeight,
    width: clientWidth,
  };
};

export const getImageRect = async (src: string) => {
  const image = await _generateWidthRemoveImage(src);
  return _getImageRect(image);
};
