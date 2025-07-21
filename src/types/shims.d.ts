declare module 'imagemin' {
  import { Plugin } from 'imagemin';

  function imagemin(
    input: string[] | Buffer[],
    output: string,
    options?: { plugins: Plugin[] }
  ): Promise<Buffer[]>

  namespace imagemin {
    function buffer(
      input: Buffer,
      options: { plugins: Plugin[] }
    ): Promise<Buffer>
  }

  export = imagemin;
}

declare module 'imagemin-mozjpeg' {
  import { Plugin } from 'imagemin';
  interface Options {
    quality?: number;
  }
  function plugin(options?: Options): Plugin;
  export = plugin;
}

declare module 'imagemin-pngquant' {
  import { Plugin } from 'imagemin';
  function plugin(options?: { quality?: [number, number] }): Plugin;
  export = plugin;
}

declare module 'imagemin-webp' {
  import { Plugin } from 'imagemin';
  function plugin(options?: { quality?: number }): Plugin;
  export = plugin;
}

declare module 'imagemin-svgo' {
  import { Plugin } from 'imagemin';
  function plugin(options?: { quality?: number }): Plugin;
  export = plugin;
}