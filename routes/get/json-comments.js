import { ObjectID } from 'mongodb'
import { parse } from 'url'

/** @type {import('../../').Middleware} */
export default async (ctx) => {
  const { csrf, linkedin_user, github_user } = ctx.session

  const { page = 1, id } = ctx.request.query
  const { referer } = ctx.request.header
  if (!referer) throw new Error('The client did not pass referer header.')
  const { path } = parse(referer)

  const skip = (page - 1) * 20

  const Comments = ctx.mongo.collection('comments')
  let comments
  if (id) {
    comments = await Comments.find({
      _id: ObjectID(id),
    }).toArray()
  } else
    comments = await Comments.find({
      path,
    }).skip(skip).limit(20).sort({ date: -1 }).toArray()

  const cm = comments.map((comment) => {
    const { linkedin_user: l, github_user: g } = comment
    if (l && linkedin_user && l.id == linkedin_user.id) {
      comment.isAuthor = true
    } else if (g && github_user && github_user.html_url == g.html_url) {
      comment.isAuthor = true
    }
    if (l) delete l.id
    delete comment.ip
    return comment
  })
  ctx.body = { comments: cm, csrf }

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

export const middleware = ['session', 'jsonErrors']

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../').Auth} Auth
 */