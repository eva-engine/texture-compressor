import { existsSync } from "fs";
import { mkdir, readdir, rm, stat } from "fs/promises";
import { dirname } from "path";
import { relative, resolve } from "path/posix";
import type { CompressType, FormatType, LinkType } from "./define";
import { compressWithCrunch } from "./tools/compressWithCrunch";
import { compressWithPVRTexTool } from "./tools/compressWithPVRTexTool";
import { getFileName, preMultiAlpha } from "./tools/util";
export * from "./define";

export const cacheDir = './.tex-cache';

export type SinglePackOptions<T extends CompressType> = LinkType<T> & {
  input: string
  output?: string
  /**
   * Intefer from 1 to 10.
   */
  quality?: number
  square?: boolean
  mipmap?: boolean
  pot?: boolean
  verbose?: boolean
  flipY?: boolean
  premultiplyAlpha?: boolean
}
export const DefaultPackOption = {
  quality: 5,
  square: false,
  mipmap: false,
  pot: false,
  verbose: true,
  flipY: false,
  premultiplyAlpha: false
}

export async function pack<T extends CompressType>(option: SinglePackOptions<T>) {
  option = Object.assign({}, DefaultPackOption, option);
  option.output = option.output || resolve(dirname(option.input), `${getFileName(option.input)}.${(option.format as string).toLowerCase()}.ktx`);

  switch (option.type) {
    case 'astc':
    case 'etc':
    case 'pvrtc':
      return await compressWithPVRTexTool(option as unknown as Required<SinglePackOptions<'pvrtc' | 'astc' | 'etc'>>);
    case 's3tc':
      if (option.premultiplyAlpha) {
        if (!existsSync(cacheDir)) {
          await mkdir(cacheDir);
        }
        const middleFilePath = `${cacheDir}/tex-cache-${getFileName(option.input)}-${Math.random()}-${Date.now()}.png`;
        await preMultiAlpha(option.input, middleFilePath);
        const result = await compressWithCrunch({ ...option, input: middleFilePath } as unknown as Required<SinglePackOptions<'s3tc'>>);
        await rm(middleFilePath);
        return result;
      } else {
        return await compressWithCrunch(option as unknown as Required<SinglePackOptions<'s3tc'>>);
      }
    default:
      throw new Error(`Compression type: ${(option as { type: string }).type} was not valid`);
  }
}

export interface PackDirOptions {
  types: {
    [key in CompressType]?: (keyof FormatType[key])[] | (keyof FormatType[key])
  }
  outDir?: string
  quality?: number
  square?: boolean
  mipmap?: boolean
  pot?: boolean
  verbose?: boolean
  flipY?: boolean
  premultiplyAlpha?: boolean
  filter?: (path: string) => boolean
  deepVerbose?: boolean
}
export const DefaultPackDirOptions = {
  quality: 5,
  square: false,
  mipmap: false,
  pot: false,
  verbose: true,
  flipY: false,
  premultiplyAlpha: false,
  deepVerbose: false
}
/**
 * 
 */
export async function packDir(path: string, options: PackDirOptions | ((path: string) => SinglePackOptions<CompressType>[])) {
  const files: string[] = [];
  const getterOptionsType = typeof options === 'function';
  const verbose = getterOptionsType ? true : options.verbose;
  const outDir = getterOptionsType ? path : (options.outDir ?? path);
  Object.assign(options, DefaultPackDirOptions, { ...options });
  const deep = async (parentPath: string) => {
    const targetPath = resolve(outDir, relative(path, parentPath));
    if (!existsSync(targetPath)) {
      await mkdir(targetPath);
    }
    const fileOrDirs = await readdir(parentPath);
    const promises = [];
    for (const name of fileOrDirs) {
      promises.push((async () => {
        const absolutePath = resolve(parentPath, name)
        const s = await stat(absolutePath);
        if (s.isFile()) {
          if (getterOptionsType || !options.filter) {
            files.push(absolutePath);
          } else {
            if (options.filter(relative(path, absolutePath))) {
              files.push(absolutePath);
            }
          }
        } else if (s.isDirectory()) {
          await deep(absolutePath);
        }
      })());
    }
    return await Promise.all(promises);
  };
  await deep(resolve(path));
  if (verbose) {
    console.log('list files waiting for generating compressed textures');
    for (const file of files) {
      console.log(file);
    }
    console.log();
  }
  for (const file of files) {
    const configs = getterOptionsType ? options(relative(path, file)) : (() => {
      const configs: SinglePackOptions<CompressType>[] = [];
      for (const [type, formats] of Object.entries(options.types)) {
        for (const format of typeof formats === 'string' ? [formats] : formats) {
          const name = getFileName(file);
          const output = resolve(outDir, relative(path, dirname(file)), `${name}.${format.toLowerCase()}.ktx`);
          configs.push({
            input: file,
            output: output,
            type: type as CompressType,
            format: format as never,
            quality: options.quality,
            square: options.square,
            mipmap: options.mipmap,
            pot: options.pot,
            verbose: options.deepVerbose,
            flipY: options.flipY,
            premultiplyAlpha: options.premultiplyAlpha
          })
        }
      }
      return configs;
    })();
    for (const config of configs) {
      await pack(config);
    }
  }
}