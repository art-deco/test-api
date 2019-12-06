import popup from '@lemuria/popup'
import './style.css'

const LinkedIn = ({ size = 'medium', host, signinLink = '/linkedin' }) => {
  let r
  if (size == 'medium') r = 1.5
  else if (size == 'large') r = 2
  return <a onClick={(e) => {
    e.preventDefault()
    const height = 610
    const width = 500
    popup(`${host}${signinLink}`, 'Sign In', width, height)
    return false
  }} onMouseOver={(e) => {
    e.currentTarget.style.background = '#0369A0'
  }} onMouseOut={(e) => {
    e.currentTarget.style.background = '#0077B5'
  }} className="LinkedInButton">
    <div className="LinkedInIn" style={`font-size:${r}rem;`}>in</div>
    <div className="LinkedInText">Sign In With LinkedIn</div>
  </a>
}

export default LinkedIn