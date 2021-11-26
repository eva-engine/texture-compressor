import { cpus } from 'os';
import { SinglePackOptions } from '..';
import { QualityDefine } from '../define';


import { spawnProcess } from './spawnProcess';

import { getImageInfo, getMipChainLevels } from './util';

/**
 * Compress texture with the S3TC compression format
 */
export const compressWithCrunch = async (args: Required<SinglePackOptions<'s3tc'>>) => {

  const targetQuality = QualityDefine[args.type];
  const quality = targetQuality[Math.round(args.quality! * .1 * (targetQuality.length - 1))];
  const flagMapping = [
    '-file',
    args.input,
    '-out',
    args.output,
    '-fileformat',
    'ktx',
    `-${args.format}`,
    '-dxtQuality',
    `${quality}`,
    '-helperThreads',
    cpus().length.toString(),
  ];

  if (args.mipmap) {
    const { width } = await getImageInfo(args.input);
    flagMapping.push('-mipMode', 'Generate');
    flagMapping.push('-maxmips', getMipChainLevels(width).toString());
  } else {
    flagMapping.push('-mipMode', 'None');
  }

  if (args.flipY) {
    flagMapping.push('-yflip');
  }

  return spawnProcess(args, flagMapping, 'crunch');
};
