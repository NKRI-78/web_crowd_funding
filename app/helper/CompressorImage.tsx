import Compressor from "compressorjs";

export const compressImage = (
  file: File,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      checkOrientation: true,
      success(result) {
        const compressedFile = new File([result], file.name, {
          type: result.type,
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      },
      error(err) {
        reject(err);
      },
    });
  });
};
