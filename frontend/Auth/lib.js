/**
 * @param {Auth} auth
 */
export const getUserData = ({ linkedin_user, github_user }) => {
  let picture, name
  if (linkedin_user) picture = linkedin_user.profilePicture
  else if (github_user) picture = github_user.avatar_url

  if (linkedin_user) name = linkedin_user.firstName + ' ' + linkedin_user.lastName
  else if (github_user) name = github_user.name || github_user.login
  return { picture, name }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../').Auth} Auth
 */