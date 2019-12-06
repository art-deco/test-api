/** @type {import('../../').Middleware} */
export default (ctx) => {
  const { linkedin_user, github_user, csrf } = ctx.session
  ctx.body = /** @type {Auth} */ ({
    linkedin_user,
    github_user: github_user ? {
      login: github_user.login,
      name: github_user.name,
      avatar_url: github_user.avatar_url,
      html_url: github_user.html_url,
    }: undefined,
    csrf,
  })
}

export const middleware = ['session']

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../').Auth} Auth
 */