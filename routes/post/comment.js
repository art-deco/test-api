import { parse } from 'url'
import { createHash } from 'crypto'
import countries from '../../frontend/countries'

const countriesMap = countries.reduce((acc, { name, code }) => {
  acc[code] = name
  return acc
}, {})

const { CAPTCHA_KEY } = process.env

const validateCaptcha = (captchaHash, captchaAnswer) => {
  if (!CAPTCHA_KEY) throw new Error('!Server error: no captcha secret.')
  if (!captchaHash) throw new Error('!Captcha ID is missing.')
  if (!captchaAnswer) throw new Error('!Captcha answer is missing.')
  const hash = createHash('md5').update(`${CAPTCHA_KEY}${captchaAnswer}`).digest('hex')
  if (hash != captchaHash) throw new Error('!Incorrect captcha answer.')
}

const validateCountry = (countryCode) => {
  if (!countryCode) return
  const country = countriesMap[countryCode]
  if (!country) throw new Error('!Unknown country code.')
  return country
}

/** @type {import('../..').Middleware} */
export default async (ctx) => {
  // debugger
  let { photo, csrf, name, country_code, comment, 'captcha-answer': captchaAnswer, captcha } = ctx.request.body
  const { referer } = ctx.request.header
  if (!referer) throw new Error('!Request came from an unknown page.')
  const { path } = parse(referer)

  let linkedin_user, github_user
  if (csrf) {
    const c = ctx.session.csrf
    linkedin_user = ctx.session.linkedin_user
    github_user = ctx.session.github_user
    // { csrf: c, linkedin_user } = ctx.session
    if (csrf != c) {
      throw new Error('!Security token does not match.')
    }
  }
  if (!linkedin_user && !github_user) {
    validateCaptcha(captcha, captchaAnswer)
  }
  validatePhoto(photo, ctx.session)
  const country = validateCountry(country_code)

  if (!comment) throw new Error('!Comment is a required field.')
  const Comments = ctx.mongo.collection('comments')

  const ip = ctx.request.ip

  const lastHour = new Date()
  lastHour.setHours(lastHour.getHours() - 1)
  const guest = !github_user && !linkedin_user

  const $or = []
  if (github_user) {
    $or.push({ 'github_user.html_url': github_user.html_url })
  }
  if (linkedin_user) {
    $or.push({ 'linkedin_user.id': linkedin_user.id })
  }
  if (guest) {
    $or.push({ ip: ip })
  }

  const found = await Comments.countDocuments({
    $or,
    date: {
      $gt: lastHour,
    },
  })
  if (found >= 5) {
    throw new Error('!You cannot comment so often!')
  }

  const res = await Comments.insertOne({
    linkedin_user,
    github_user,
    name,
    comment,
    photo,
    ...(guest ? { ip } : {}),
    ...(country ? { country } : {}),
    date: new Date(),
    path,
  })

  ctx.body = { ok: res.result.ok, id: res.insertedId }
}

/**
 * @param {Auth} auth
 */
const validatePhoto = (photo, { linkedin_user, github_user }) => {
  if (!photo) return
  let photoValidated = false

  if (linkedin_user && linkedin_user.profilePicture == photo) {
    photoValidated = true
  } else if (github_user && github_user.avatar_url == photo) {
    photoValidated = true
  }
  if (!photoValidated) throw new Error('Unknown photo')
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../').Auth} Auth
 */

export const middleware = (route) =>
  ['session', 'nicer', 'jsonErrors', route]