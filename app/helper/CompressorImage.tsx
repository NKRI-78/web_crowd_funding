"use client";

import Compressor from "compressorjs";

export const compressImage = (file: File, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("compressImage must be run on the client."));
    }

    if (!(file instanceof File)) {
      console.error("compressImage error: Bukan File object", file);
      return reject(new Error("Input must be a File object."));
    }

    if (!file.type.startsWith("image/")) {
      console.warn("Bukan file gambar, skip compression:", file.type);
      return resolve(file);
    }

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
