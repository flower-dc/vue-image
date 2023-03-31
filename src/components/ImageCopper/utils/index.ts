export const canvas2Blob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise(function (resolve) {
    canvas.toBlob(function (blob) {
      if (!blob) return resolve(null);
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
