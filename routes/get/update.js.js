// import { getMap } from 'alamode/build/lib/source-map'
import { basename, dirname } from 'path'

const src = `const rnd = Math.random()

export const test = () => {
  console.log('test %s', rnd)
}`

/** @type {import('koa').Middleware} */
export default (ctx) => {
  ctx.type = 'application/javascript'
  // const map = getMap({
  //   originalSource: `${src}// hot-module-reload util`,
  //   pathToSrc: basename(ctx.path),
  //   sourceRoot: dirname(ctx.path),
  // })
  // const b64 = Buffer.from(map).toString('base64')
  // const s = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${b64}`
  const s = ''
  const e = 'export'
  ctx.body = `${src.replace('export', '      ')}
window.proxies = window.proxies || {}
window.proxies['${ctx.path}'] = window.proxies['${ctx.path}'] || {}
window.proxies['${ctx.path}']['test'] = test
const testProxy = (...args) => window.proxies['${ctx.path}']['test'](...args)
${e} { testProxy as test }
${s}
`
// const test_PROXY = new Proxy
}