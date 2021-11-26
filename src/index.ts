import { existsSync } from "fs";
import { mkdir, readdir, rm, stat } from "fs/promises";
import { relative, resolve } from "path/posix";
import type { CompressType, FormatType, LinkType } from "./define";
import { compressWithCrunch } from "./tools/compressWithCrunch";
import { compressWithPVRTexTool } from "./tools/compressWithPVRTexTool";
import { getFileName, preMultiAlpha } from "./tools/util";

export const cacheDir = './.tex-cache';

export interface SinglePackOptions<T extends CompressType> extends LinkType<T> {
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

  option.output = option.output || resolve(option.input, './', `${getFileName(option.input)}.${option.format}.ktx`);

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
        const middleFilePath = `${cacheDir}/tex-cache-${Date.now()}.png`;
        await preMultiAlpha(option.input, middleFilePath);
        const result = await compressWithCrunch({ ...option, input: middleFilePath } as unknown as Required<SinglePackOptions<'s3tc'>>);
        await rm(middleFilePath);
        return result;
      } else {
        return await compressWithCrunch(option as unknown as Required<SinglePackOptions<'s3tc'>>);
      }
    default:
      throw new Error(`Compression type: ${option.type} was not valid`);
  }
}

export interface PackDirOptions {
  types: {
    [key in CompressType]?: keyof FormatType[key]
  }[]
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
  Object.assign(options, DefaultPackDirOptions, options);
  const deep = async (parentPath: string) => {
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
  const promises = [];
  for (const file of files) {
    const configs = getterOptionsType ? options(relative(file, path)) : (() => {
      const outDir = options.outDir || path;
      const configs: SinglePackOptions<CompressType>[] = [];
      for (const item of options.types) {
        for (const [type, format] of Object.entries(item)) {
          const name = getFileName(file);
          const output = resolve(relative(outDir, path), file, '../', `${name}.${format.toLowerCase()}.ktx`);
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
    promises.push((async () => {
      for (const config of configs) {
        console.log(1, config.output);
        await pack(config);
        console.log(2, config.output);
      }
    })())

  }
  return await Promise.allSettled(promises);
}


(async () => {
  // await pack({
  //   input: './test/cat.png',
  //   output: './test/cat.dxt5.ktx',
  //   type: 's3tc',
  //   format: 'DXT5',
  //   quality: 10,
  //   premultiplyAlpha: true,
  //   verbose: false
  // });
  await packDir('./test', {
    types: [
      {
        'astc': 'ASTC_12x12',
        's3tc': 'DXT1A'
      },
      {
        's3tc': 'DXT5'
      }
    ],
    filter: (path: string) => path.endsWith('cat.png'),
    verbose: true,

  });
})();