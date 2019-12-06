/**
 * @type {import('../../').Middleware}
 */
export default (ctx) => {
  const { csrf } = ctx.session
  if (!csrf) {
    ctx.body = { error: 'not signed in' }
    ctx.status = 400
    return
  }
  const { csrf: c } = ctx.request.body
  if (csrf != c) {
    ctx.body = { error: 'invalid csrf token' }
    ctx.status = 401
    return
  }
  ctx.session = null
  ctx.body = { ok: 1 }
}

export const middleware = (route) =>
  ['session', 'nicer', route]