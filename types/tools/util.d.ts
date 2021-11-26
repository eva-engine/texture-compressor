import sharp from "sharp";
export declare const getImageInfo: (path: string) => Promise<sharp.OutputInfo>;
export declare const getFileExtension: (filepath: string) => string;
export declare const getMipChainLevels: (value: number) => number;
export declare const preMultiAlpha: (input: string, output: string) => Promise<sharp.OutputInfo>;
export declare const getFileName: (filepath: string) => string;
