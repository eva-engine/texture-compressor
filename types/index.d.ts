import type { CompressType, FormatType, LinkType } from "./define";
export declare const cacheDir = "./.tex-cache";
export interface SinglePackOptions<T extends CompressType> extends LinkType<T> {
    input: string;
    output?: string;
    /**
     * Intefer from 1 to 10.
     */
    quality?: number;
    square?: boolean;
    mipmap?: boolean;
    pot?: string;
    verbose?: boolean;
    flipY?: boolean;
    premultiplyAlpha?: boolean;
}
export declare const DefaultPackOption: {
    quality: number;
    square: boolean;
    mipmap: boolean;
    pot: string;
    verbose: boolean;
    flipY: boolean;
    premultiplyAlpha: boolean;
};
export declare function pack<T extends CompressType>(option: SinglePackOptions<T>): Promise<any>;
export interface PackDirOptions {
    types: {
        [key in CompressType]?: keyof FormatType[key];
    }[];
    outDir?: string;
    quality?: number;
    square?: boolean;
    mipmap?: boolean;
    pot?: string;
    verbose?: boolean;
    flipY?: boolean;
    premultiplyAlpha?: boolean;
    filter?: (path: string) => boolean;
    deepVerbose?: boolean;
}
export declare const DefaultPackDirOptions: {
    quality: number;
    square: boolean;
    mipmap: boolean;
    pot: string;
    verbose: boolean;
    flipY: boolean;
    premultiplyAlpha: boolean;
    deepVerbose: boolean;
};
/**
 *
 */
export declare function packDir(path: string, options: PackDirOptions | ((path: string) => SinglePackOptions<CompressType>[])): Promise<void>;
