export type CompressType = keyof FormatType;
export const CompressType = {
  astc: 'astc',
  pvrtc: 'pvrtc',
  etc: 'etc',
  s3tc: 's3tc'
}
export const FormatType = {
  astc: {
    ASTC_4x4: 'ASTC_4x4',
    ASTC_5x4: 'ASTC_5x4',
    ASTC_5x5: 'ASTC_5x5',
    ASTC_6x5: 'ASTC_6x5',
    ASTC_6x6: 'ASTC_6x6',
    ASTC_8x5: 'ASTC_8x5',
    ASTC_8x6: 'ASTC_8x6',
    ASTC_8x8: 'ASTC_8x8',
    ASTC_10x5: 'ASTC_10x5',
    ASTC_10x6: 'ASTC_10x6',
    ASTC_10x8: 'ASTC_10x8',
    ASTC_10x10: 'ASTC_10x10',
    ASTC_12x10: 'ASTC_12x10',
    ASTC_12x12: 'ASTC_12x12',
    ASTC_3x3x3: 'ASTC_3x3x3',
    ASTC_4x3x3: 'ASTC_4x3x3',
    ASTC_4x4x3: 'ASTC_4x4x3',
    ASTC_4x4x4: 'ASTC_4x4x4',
    ASTC_5x4x4: 'ASTC_5x4x4',
    ASTC_5x5x4: 'ASTC_5x5x4',
    ASTC_5x5x5: 'ASTC_5x5x5',
    ASTC_6x5x5: 'ASTC_6x5x5',
    ASTC_6x6x5: 'ASTC_6x6x5',
    ASTC_6x6x6: 'ASTC_6x6x6'
  },
  etc: {
    ETC1: 'ETC1',
    ETC2_RGBA: 'ETC2_RGBA',
    ETC2_RGB: 'ETC2_RGB'
  },
  pvrtc: {
    PVRTC1_2: 'PVRTC1_2',
    PVRTC1_4: 'PVRTC1_4',
    PVRTC1_2_RGB: 'PVRTC1_2_RGB',
    PVRTC1_4_RGB: 'PVRTC1_4_RGB'
  },
  s3tc: {
    DXT1: 'DXT1',
    DXT1A: 'DXT1A',
    DXT3: 'DXT3',
    DXT5: 'DXT5'
  }
} as const;
export interface LinkType<T extends CompressType> {
  type: T
  format: keyof FormatType[T]
}
export type FormatType = typeof FormatType;

export const QualityDefine = {
  astc: [
    'astcveryfast',
    'astcfast',
    'astcmedium',
    'astcthorough',
    'astcexhaustive',
  ],
  etc: ['etcfast', 'etcslow', 'etcfastperceptual', 'etcslowperceptual'],
  pvrtc: [
    'pvrtcfastest',
    'pvrtcfast',
    'pvrtcnormal',
    'pvrtchigh',
    'pvrtcbest',
  ],
  s3tc: ['superfast', 'fast', 'normal', 'better', 'uber']
} as const