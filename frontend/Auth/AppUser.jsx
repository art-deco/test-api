import LinkedIn from '../social/LinkedIn'
import GitHub from '../social/GitHub'
import User from './User'

/**
 * @param {Object} props
 * @param {Auth} props.auth
 */
const AppUser = ({ error, loading, auth, onSignOut, host }) => {
  if (error)
    return (<div>Error: {error}</div>)
  if (loading)
    return (<div>Loading...</div>)
  // if (!auth.user)
  const loggedIn = auth.linkedin_user || auth.github_user
  return (<div>
    {!loggedIn && <span style="display:block">To display the profile image and validate your GitHub profile, sign in. No advanced permissions are required other than default ones (no email). Your public LinkedIn ID remains unknown. You will not be able to delete/edit your comment as a guest. <a href="/privacy-policy.html">Privacy Policy</a></span>}

    <User auth={auth} onSignout={onSignOut} host={host}/>

    {!auth.linkedin_user && <LinkedIn host={host}/>}
    {!auth.linkedin_user && ' '}
    {!auth.github_user && <GitHub host={host} />}

  </div>)
}

export default AppUser