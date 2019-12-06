import { aqt } from 'rqt'

/** @type {import('../..').Middleware} */
export default async (ctx) => {
  const { github_user } = ctx.session
  if (!github_user) throw new Error('!You must login with GitHub.')

  const { user } = ctx.request.query
  const { statusCode, body, headers: { location } } = await aqt(`https://www.npmjs.com/~${user}`, {
    headers: {
      'User-Agent': 'Idio Template {{ frontend }}',
    },
  })
  if (statusCode == 302 && location.startsWith('/org'))
    throw new Error('!You specified an organisation.')
  if (statusCode == 404) throw new Error('!User not found.')
  if (statusCode != 200) throw new Error('!Error fetching npm user.')

  const gh = /<a rel="nofollow" href="https:\/\/github.com\/(.+?)"/.exec(body)
  if (!gh) throw new Error('!GitHub profile not specified on NPM page.')
  const [, u] = gh
  if (u != github_user.login) throw new Error(`!The GitHub username (${u}) does not match.`)

  const res = /href="\?activeTab=packages"><span><span class="(?:.+)">(\d+)<\/span>Packages<\/span><\/a>/.exec(body)
  if (!res) throw new Error('!Could not extract packages count')
  const [, count] = res
  ctx.body = {
    user,
    count: parseInt(count, 10),
  }
}

export const middleware = ['jsonErrors']