import { spawnProcess } from './spawnProcess';


import { getImageInfo, getMipChainLevels } from './util';
import { SinglePackOptions } from '..';
import { QualityDefine } from '../define';

/**
 * Compress texture with the ASTC, ETC or PVRTC compression format
 */
export const compressWithPVRTexTool = async (args: Required<SinglePackOptions<'astc' | 'etc' | 'pvrtc'>>) => {

  const targetQuality = QualityDefine[args.type];
  const quality = targetQuality[Math.round(args.quality! * .1 * (targetQuality.length - 1))];

  const flagMapping = [
    '-i',
    args.input,
    '-o',
    args.output,
    '-f',
    `${args.format}`,
    `-q`,
    `${quality}`,
  ];

  if (args.premultiplyAlpha) {
    flagMapping.push('-p');
  }

  if (args.square) {
    flagMapping.push('-square', '+');
  }

  if (args.pot) {
    flagMapping.push('-pot', '+');
  }

  if (args.mipmap) {
    const { width } = await getImageInfo(args.input);
    flagMapping.push('-m', getMipChainLevels(width).toString());
  }

  if (args.flipY) {
    flagMapping.push('-flip', 'y');
  }

  return await spawnProcess(args, flagMapping, 'PVRTexToolCLI');
};
