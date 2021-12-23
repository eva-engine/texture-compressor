# @eva/texture-compressor

The compressed texture generation scheme of eva.js can be used as CLI tool or node module

## how to use

### Installation

for using it by command line you need install @eva/texture-compressor global

```sh
  $ npm i @eva/texture-compressor -g
```

or you only use it as a node module

```sh
  $ npm i @eva/texture-compressor
```

### CLI

The command line provides simple configuration to enable you to generate compressed textures

```sh
  eva-compress img.jpg -t astc,etc,pvrtc,s3tc
```

For more command line usage, see the help command

```sh
  eva-compress -h
```

### Node Module

By calling this module, you will be able to use all activities.

```javascript
/**
 * compress one image to one compress format.
 * Based on this method, you can encapsulate a compressed texture workflow that is more suitable for your project.
 */
await pack({
  input: './images/a.jpg',
  output: './images/a.astc.jpg',
  type: 'astc',
  format: 'ASTC_4x4',
  // compress quality, use 1--10
  quality: 10,
  square: false,
  mipmap: true,
  pot: false,
  verbose: true,
  flipY: false,
  premultiplyAlpha: true,
})

/**
 * An encapsulation of the basic pack method,
 * which can more easily generate compressed textures for all files in the folder
 */
await packDir('./assets/images', {
  types: {
    // for one format you can give a string
    astc: 'ASTC_6x6',
    // for multi formats you can give a string array
    etc: ['ETC1', 'ETC2_RGB'],
  },
  outDir: './asserts/textures',
  filter: (path) => path.endsWith('.jpg') || path.endsWith('.png'),
  quality: 8,
  square: false,
  mipmap: false,
  pot: false,
  verbose: true,
  flipY: false,
  premultiplyAlpha: false,
  deepVerbose: true,
})
```
