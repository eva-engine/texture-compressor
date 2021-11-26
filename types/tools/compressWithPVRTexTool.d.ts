import { SinglePackOptions } from '..';
/**
 * Compress texture with the ASTC, ETC or PVRTC compression format
 */
export declare const compressWithPVRTexTool: (args: Required<SinglePackOptions<'astc' | 'etc' | 'pvrtc'>>) => Promise<any>;
