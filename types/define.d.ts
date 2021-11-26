export declare type CompressType = keyof FormatType;
export declare const CompressType: {
    astc: string;
    pvrtc: string;
    etc: string;
    s3tc: string;
};
export declare const FormatType: {
    readonly astc: {
        readonly ASTC_4x4: "ASTC_4x4";
        readonly ASTC_5x4: "ASTC_5x4";
        readonly ASTC_5x5: "ASTC_5x5";
        readonly ASTC_6x5: "ASTC_6x5";
        readonly ASTC_6x6: "ASTC_6x6";
        readonly ASTC_8x5: "ASTC_8x5";
        readonly ASTC_8x6: "ASTC_8x6";
        readonly ASTC_8x8: "ASTC_8x8";
        readonly ASTC_10x5: "ASTC_10x5";
        readonly ASTC_10x6: "ASTC_10x6";
        readonly ASTC_10x8: "ASTC_10x8";
        readonly ASTC_10x10: "ASTC_10x10";
        readonly ASTC_12x10: "ASTC_12x10";
        readonly ASTC_12x12: "ASTC_12x12";
        readonly ASTC_3x3x3: "ASTC_3x3x3";
        readonly ASTC_4x3x3: "ASTC_4x3x3";
        readonly ASTC_4x4x3: "ASTC_4x4x3";
        readonly ASTC_4x4x4: "ASTC_4x4x4";
        readonly ASTC_5x4x4: "ASTC_5x4x4";
        readonly ASTC_5x5x4: "ASTC_5x5x4";
        readonly ASTC_5x5x5: "ASTC_5x5x5";
        readonly ASTC_6x5x5: "ASTC_6x5x5";
        readonly ASTC_6x6x5: "ASTC_6x6x5";
        readonly ASTC_6x6x6: "ASTC_6x6x6";
    };
    readonly etc: {
        readonly ETC1: "ETC1";
        readonly ETC2_RGBA: "ETC2_RGBA";
        readonly ETC2_RGB: "ETC2_RGB";
    };
    readonly pvrtc: {
        readonly PVRTC1_2: "PVRTC1_2";
        readonly PVRTC1_4: "PVRTC1_4";
        readonly PVRTC1_2_RGB: "PVRTC1_2_RGB";
        readonly PVRTC1_4_RGB: "PVRTC1_4_RGB";
    };
    readonly s3tc: {
        readonly DXT1: "DXT1";
        readonly DXT1A: "DXT1A";
        readonly DXT3: "DXT3";
        readonly DXT5: "DXT5";
    };
};
export interface LinkType<T extends CompressType> {
    type: T;
    format: keyof FormatType[T];
}
export declare type FormatType = typeof FormatType;
export declare const QualityDefine: {
    readonly astc: readonly ["astcveryfast", "astcfast", "astcmedium", "astcthorough", "astcexhaustive"];
    readonly etc: readonly ["etcfast", "etcslow", "etcfastperceptual", "etcslowperceptual"];
    readonly pvrtc: readonly ["pvrtcfastest", "pvrtcfast", "pvrtcnormal", "pvrtchigh", "pvrtcbest"];
    readonly s3tc: readonly ["superfast", "fast", "normal", "better", "uber"];
};
