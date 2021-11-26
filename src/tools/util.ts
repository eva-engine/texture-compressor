import { basename, parse } from "path";
import sharp from "sharp";

export const getImageInfo = async (path: string) => await (await sharp(path).toBuffer({ resolveWithObject: true })).info;

export const getFileExtension = (filepath: string): string => parse(filepath).ext;

export const getMipChainLevels = (value: number): number => Math.floor(Math.log2(value)) + 1;

export const preMultiAlpha = async (input: string, output: string) => {
  const image = await sharp(input).raw().toBuffer({ resolveWithObject: true });
  const { info, data } = image;
  if (info.channels === 4) {
    for (let i = 0; i < data.length; i += 4) {
      let alpha = data[i + 3] / 255
      data[i] = data[i] * alpha;
      data[i + 1] = data[i + 1] * alpha;
      data[i + 2] = data[i + 2] * alpha;
    };
  }
  return await sharp(new Uint8Array(data), {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  }).png({
    compressionLevel: 0
  }).toFile(output);
}

export const getFileName = (filepath: string): string =>
  basename(filepath, getFileExtension(filepath));
