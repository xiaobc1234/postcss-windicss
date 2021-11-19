# postcss-windicss-postcss7

[![NPM version](https://img.shields.io/npm/v/postcss-windicss?color=a1b858&label=)](https://www.npmjs.com/package/postcss-windicss)

> fork from postcss-windicss. 在postcss-windicss插件上增加postcss7支持

> 🧪 Experimental.

> ⚠️ Using this package is **discouraged** as there are some limitations of PostCSS's API. Use our [first-class integrations](https://next.windicss.org/guide/installation.html) for each dedicated framework/build tool to get the best developer experience and performance. This plugin should be your last option to use Windi CSS.

## Installation

Install `postcss-windicss-postcss7` from NPM

```bash
npm i -D postcss-windicss-postcss7
```

Create `postcss.config.js` under your project root.

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-windicss': {
      /* Options */
    },
  },
}
```

Add `@windicss` to your main css entry:

```css
/* main.css */
@windicss;
```

Create `windi.config.js` / `windi.config.ts` under your project root with the following configurations

```js
// windi.config.js
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['src/**/*.{html,vue,jsx,tsx,svelte}'],
  },
  /* ... */
})
```

And enjoy!

## build-scripts support

```js

module.exports = ({ context, onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    // postcss方式
    const setModuleScss = (config) => {
      config.module
        .rule('scss')
        .use('postcss-loader')
        .tap((opts = {}) => {
          if (!opts.plugins) {
            opts.plugins = [];
          }
          opts.plugins.push(require('postcss-windicss-postcss7'));
          return opts;
        });
    };
    setModuleScss(config);
  });
};

```


## Configuration

You can pass options to the plugin by

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-windicss': {
      config: 'path/to/windi.config.js', // by default it will try to find it in your project root
    }
  }
}
```

The full configuration options can be found [here](https://github.com/windicss/vite-plugin-windicss/blob/main/packages/plugin-utils/src/options.ts)

## Dev / Build modes

`postcss-windicss-postcss7` has two different modes, one for incremental dev serving and one for a one-time production build. It's based on your `process.env.NODE_ENV` value.

If the tool you use does not infer it to you, you can always set them explicitly by

```bash
cross-env NODE_ENV=production npm run build # production mode
cross-env NODE_ENV=development npm run build # development mode
```

## Touch Mode

By default, this plugin "touches" your css entry by updating the file's "updated time" (utime) to trigger the hot reload without changing its content.

It should work most of the time. But for some tools, they might also compare the file's content to avoid unnecessary hot reloads. In that cases, you will need to specify `touchMode` to `insert-comment` to get proper style updates with those tools.

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-windicss': {
      touchMode: 'insert-comment' // <--
    }
  }
}
```

## Progress

### Features

- [x] Build
- [x] Hot reload
- [x] Inline class utilities 
- [x] Load TypeScript / ESM configure
- [x] `@apply` `@screen` `@variants` `theme()`
- [ ] `@layer` 
- [ ] "Design in DevTools"
- [ ] Variant Groups (probably not possible)

### Frameworks

Currently tested on 

- [x] Vite
- [x] Webpack
- [x] Snowpack

Feel free to add more if you got it working on other tools/frameworks!

#### Integrations

- [@leanup/stack](https://leanupjs.org)

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2021 [Anthony Fu](https://github.com/antfu)
