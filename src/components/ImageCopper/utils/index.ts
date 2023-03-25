export const getCanvasBlob = (
  canvas: HTMLCanvasElement
): Promise<Blob | null> =>
  new Promise(function (resolve, reject) {
    canvas.toBlob(function (blob) {
      if (!blob) return reject(null);
      resolve(blob);
    });
  });

export const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
