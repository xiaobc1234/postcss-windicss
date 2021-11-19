import exitHook from 'exit-hook'
import { parse, plugin as PostcssPlugin } from 'postcss'
import { createUtils } from '@windicss/plugin-utils'
// import type { Plugin } from 'postcss'
import { shutdownWatcher, startDevWatcher } from './dev'
import { context, debug, isDev, WindiPostCSSPluginOptions } from './context'

const plugin = (options: WindiPostCSSPluginOptions): any => {
  if (!context.utils) {
    context.utils = createUtils({
      ...options,
      onOptionsResolved() {
        if (isDev)
          setTimeout(() => startDevWatcher(options))
      },
    }, {
      name: 'postcss-windicss',
    })

    if (isDev)
      exitHook(shutdownWatcher)

    debug(isDev ? 'development mode' : 'production mode')
  }

  const utils = context.utils

  return (root) => {
    const promiseArray: any[] = []
    root.walkAtRules((atRule) => {
      const entry = atRule.root().source?.input.from
      if (atRule.name === 'windicss') {
        context.entry = entry
        promiseArray.push(utils.generateCSS().then((data) => {
          atRule.replaceWith(parse(data))
        }))
        // atRule.replaceWith(parse(await utils.generateCSS()))
      }
      // @apply
      else if (['apply'].includes(atRule.name)) {
        const rule = atRule.parent!
        if (!rule)
          return

        // await utils.ensureInit()
        promiseArray.push(utils.ensureInit().then(() => {
          const css = rule.toString()
          const transformed = css ? utils.transformCSS(css, entry || '') : undefined
          if (transformed)
            rule.replaceWith(parse(transformed))
        }))
      }
      // @screen, @variants
      else if (['screen', 'variants'].includes(atRule.name)) {
        // await utils.ensureInit()
        promiseArray.push(utils.ensureInit().then(() => {
          const css = atRule.toString()
          const transformed = css ? utils.transformCSS(css, entry || '') : undefined
          if (transformed)
            atRule.replaceWith(parse(transformed))
        }))
      }
    })
    root.walkDecls((decl) => {
      // We work with each `decl` object here.
      const match = decl.value.match(/^\s*theme\((['"])(.*)\1\)\s*$/)
      if (match && match[2])
        decl.value = (utils.processor.theme(match[2]) as any).toString()
    })
    return Promise.all(promiseArray)
  }

  // return {
  //   postcssPlugin: 'postcss-windicss',
  //   async AtRule(atRule) {
  //     const entry = atRule.root().source?.input.from
  //     if (atRule.name === 'windicss') {
  //       context.entry = entry
  //       atRule.replaceWith(parse(await utils.generateCSS()))
  //     }
  //     // @apply
  //     else if (['apply'].includes(atRule.name)) {
  //       const rule = atRule.parent!
  //       if (!rule)
  //         return

  //       await utils.ensureInit()
  //       const css = rule.toString()
  //       const transformed = css ? utils.transformCSS(css, entry || '') : undefined
  //       if (transformed)
  //         rule.replaceWith(parse(transformed))
  //     }
  //     // @screen, @variants
  //     else if (['screen', 'variants'].includes(atRule.name)) {
  //       await utils.ensureInit()
  //       const css = atRule.toString()
  //       const transformed = css ? utils.transformCSS(css, entry || '') : undefined
  //       if (transformed)
  //         atRule.replaceWith(parse(transformed))
  //     }
  //   },
  //   Declaration(decl) {
  //     // theme()
  //     const match = decl.value.match(/^\s*theme\((['"])(.*)\1\)\s*$/)
  //     if (match && match[2])
  //       decl.value = (utils.processor.theme(match[2]) as any).toString()
  //   },
  // }
}

export const postcss = true

plugin.postcss = true

module.exports = PostcssPlugin('postcss-windicss', plugin)
