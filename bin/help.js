const helper = new class {
  roles = []
  add(cmd, messages) {
    this.roles.push([cmd, messages]);
  }
  toHelpString() {
    let str = '';
    for (const [cmd, messages] of this.roles) {
      str += '\n';
      const a = cmd.join(' , ');
      str += a;
      str += ' '.repeat(30 - a.length);
      str += messages.join('\n');
      str += '\n';
    }
    return str;
  }
}

helper.add(['-t {}', '--type {}'], [
  'Define output compress type, use dot to split type in [astc, etc, pvrtc, s3tc]',
  'eva-compress img.jpg -t astc',
  'eva-compress imgDir --type astc,etc,pvrtc,s3tc',
]);
helper.add(['-o {}', '--output {}'], [
  'Define output location',
  'eva-compress img.png -t astc -o img.astc.ktx',
  'eva-compress imgDir -o outDir',
  `Warning: don't use this flag when input is not a file or there are more than one type`
])
helper.add(['-q {}', '--quality {}'], [
  'Define compress quality between 1 to 10',
  'eva-compress img.png -q 10'
])
helper.add(['-m', '--mipmap'], [
  'Define whether to generate mipmaps'
])
helper.add(['-y', '--flipY'], [
  'Define whether to flip image vertically'
])
helper.add(['--square'], [
  'Define whether to force the texture into a square',
])
helper.add(['--pot'], [
  'Define whether to force the texture into power of two dimensions'
])
helper.add(['-p'], [
  'Define whether to permultiply alpha channel'
])

helper.add(['extra examples:'], [
  '',
  'eva-compress ./res/a.jpg ./res/b.jpg -t astc,etc -q 10 -p',
  'eva-compress ./res/imgs -o ./res/textures'
])
module.exports = helper;