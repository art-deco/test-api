import popup from '@lemuria/popup'
import Icon from './icon'
import './style.css'

export default function GitHub({ size = 'medium', host, signinLink = '/github' }) {
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
    e.currentTarget.style.background = '#bcbcbc'
  }} onMouseOut={(e) => {
    e.currentTarget.style.background = '#DFDFDF'
  }} className="GitHubButton">
    <div className="GitHubLogo" style={`height:${r}rem;font-size:${r}rem`}><Icon height="100%" style="margin-top:-4px" /></div>
    <div className="GitHubText">Sign In With GitHub</div>
  </a>
}