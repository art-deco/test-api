import { ObjectID } from 'mongodb'
/** @type {import('../../').Middleware} */
export default async (ctx) => {
  const { csrf: c, linkedin_user, github_user } = ctx.session
  if (!c) throw new Error('You\'re not logged in.')

  const { csrf, id } = ctx.request.query

  if (!id) throw new Error('Comment ID is missing.')
  if (csrf != c) throw new Error('Security token is incorrect.')

  const Comments = ctx.mongo.collection('comments')
  const oid = new ObjectID(id)
  const found = await Comments.findOne({
    _id: oid,
  })

  if (!found) throw new Error('Comment not found.')

  let isAuthor = false
  if (linkedin_user && found.linkedin_user && linkedin_user.id == found.linkedin_user.id) {
    isAuthor = true
  } else if (github_user && found.github_user && github_user.html_url == found.github_user.html_url) {
    isAuthor = true
  }
  if (!isAuthor) throw new Error('You\'re not the author of this comment.')
  // ban
  const res = await Comments.deleteOne({
    _id: oid,
  })

  ctx.body = { ok: res.deletedCount }

  // const { linkedin_user, github_user, csrf } = ctx.session
  // ctx.body = /** @type {Auth} */ ({
  //   linkedin_user,
  //   github_user: github_user ? {
  //     login: github_user.login,
  //     name: github_user.name,
  //     avatar_url: github_user.avatar_url,
  //     html_url: github_user.html_url,
  //   }: undefined,
  //   csrf,
  // })
}

export const middleware = ['jsonErrors', 'session']

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../').Auth} Auth
 */