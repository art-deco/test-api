import { create } from 'svg-captcha'
import { createHash } from 'crypto'

const { CAPTCHA_KEY } = process.env

/** @type {import('../..').Middleware} */
export default async (ctx) => {
  if (!CAPTCHA_KEY) throw new Error('!Server error: no captcha secret.')
  const { data, text } = create({ noise: 3, color: true, size: 5, ignoreChars: '0o1iIlO' })
  const hash = createHash('md5').update(`${CAPTCHA_KEY}${text}`).digest('hex')
  ctx.body = {
    data, hash,
  }
}

export const middleware = ['jsonErrors']