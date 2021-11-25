// Compressors
import { spawnProcess } from './spawnProcess';


// Utilities
import { getImageInfo, getMipChainLevels } from './image';
import { SinglePackOptions } from '..';

/**
 * Compress texture with the ASTC, ETC or PVRTC compression format
 */
export const compressWithPVRTexTool = async (args: SinglePackOptions<'astc' | 'etc' | 'pvrtc'>): Promise<any> => {

  const flagMapping = [
    '-i',
    args.input,
    '-o',
    args.output,
    '-f',
    `${args.format}`,
    `-q`,
    `${args.quality}`,
  ];

  if (args.square) {
    flagMapping.push('-square', '+');
  }

  if (args.pot !== 'no') {
    flagMapping.push('-pot', args.pot || '+');
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
