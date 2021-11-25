import type { CompressType, FormatType, LinkType } from "./define";
import { compressWithPVRTexTool } from "./tools/compressWithPVRTexTool";

export interface SinglePackOptions<T extends CompressType> extends LinkType<T> {
  input: string
  output: string
  /**
   * Intefer from 1 to 10.
   */
  quality?: number
  square?: boolean
  mipmap?: boolean
  pot?: string
  verbose?: boolean
  flipY?: boolean
}
export const DefaultPackOption = {
  quality: 5,
  square: false,
  mipmap: false,
  pot: false,
  verbose: true,
  flipY: false
}
export async function pack<T extends CompressType>(option: SinglePackOptions<T>) {
  option = Object.assign({}, DefaultPackOption, option);
  switch (option.type) {
    case 'astc':
    case 'etc':
    case 'pvrtc':
      return await compressWithPVRTexTool(option as unknown as SinglePackOptions<'pvrtc' | 'astc' | 'etc'>);
    default:
      throw new Error(`Compression type: ${option.type} was not valid`);
  }
}