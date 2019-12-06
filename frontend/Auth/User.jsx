import callbackFetch from '../fetch'
import { getUserData } from './lib'

const signOut = (host, csrf, cb) => {
  const formData = new FormData()
  formData.append('csrf', csrf)

  callbackFetch(`${host}/signout`, (err, res) => {
    if (err) return cb(err)
    const { error } = res.json()
    cb(error)
  }, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
    credentials: 'include',
  })
}

/**
 * @param {Object} opts
 * @param {Auth} opts.auth
 */
const User = ( { auth, onSignout = () => {}, host }) => {
  const { linkedin_user, github_user, csrf } = auth
  if (!linkedin_user && !github_user) return null

  const { picture, name } = getUserData(auth)

  return (<div>
    <img src={picture} width="50"/>
    Hello, {name}!{' '}
    <a href="#" onClick={(e) => {
      e.preventDefault()
      signOut(host, csrf, (err) => {
        if (err) alert(`Could not sign out: ${err}. Please refresh the page and try again. Alternatively, clear your cookies.`)
        else onSignout()
      })
      return false
    }}>Sign Out</a>
  </div>)
}

export default User

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../..').Auth} Auth
 */
