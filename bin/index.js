#!/usr/bin/env node

const { stat } = require("fs/promises");
const minimist = require("minimist");
const { pack, packDir, FormatType } = require('../dist');
const helper = require("./help");

const args = minimist(process.argv.slice(2));

const targets = args._;
const output = args.o || args.output;
const quality = parseInt(args.q || args.quality) || 5;
const mipmap = !!(args.m || args.mipmap);
const flipY = !!(args.y || args.flipY);
const square = args.square;
const pot = !!args.pot;
const preMultiplyAlpha = !!args.p;
const needHelp = !!(args.h || args.help);

if(needHelp){
  console.log(helper.toHelpString());
  process.exit(0);
}

const types = (args.t ?? args.types)?.split(',') ?? ['astc', 'etc', 'pvrtc', 's3tc'];

const map = {
  astc: FormatType.astc.ASTC_4x4,
  etc: FormatType.etc.ETC2_RGBA,
  pvrtc: FormatType.pvrtc.PVRTC1_4_RGB,
  s3tc: FormatType.s3tc.DXT5
}
const formats = types.map(v => map[v]);

(async () => {
  for (const target of targets) {
    await generate(target);
  }
})()
async function generate(target) {
  if (await (await stat(target)).isDirectory()) {
    const typeObj = {};
    for (const type of types) {
      typeObj[type] = map[type];
    }
    packDir(target, {
      outDir: output,
      types: [typeObj],
      quality,
      mipmap,
      flipY,
      square,
      preMultiplyAlpha,
      pot,
      verbose: true,
      deepVerbose: true,
      filter(path) {
        const ext = path.split('.').pop();
        return ['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(ext);
      }
    })
  } else {
    for (let i = 0, len = types.length; i < len; i++) {
      pack({
        input: target,
        output: output,
        type: types[i],
        format: formats[i],
        quality,
        mipmap,
        flipY,
        square,
        preMultiplyAlpha,
        pot
      })
    }
  }
}