import lz from 'lz-string';

export const saveCpsItem = (k, v) => (
      localStorage.setItem(k, lz.compressToUTF16(
                  JSON.stringify(v)))
);

export const getCpsItem = k => {
  const v = localStorage.getItem(k);
  if (v) {
    return JSON.parse(
                  lz.decompressFromUTF16(
                                          localStorage.getItem(k)));
  }

  return undefined;
};

export const removeCpsItem = k => localStorage.removeItem(k);
