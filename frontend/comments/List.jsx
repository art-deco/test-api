import { Component } from 'preact'
import callbackFetch from '../fetch'
import './style.css'
// import fetch from 'unfetch'

export default class List extends Component {
  constructor() {
    super()
    this.state = {
      /** @type {!Array<Comment>} */
      comments: [],
      page: 0,
      csrf: null,
    }
  }
  componentDidMount() {
    this.fetch()
  }
  /**
   * @param {string} [id]
   */
  fetch(id) {
    this.setState({ loading: true })
    const i = id ? `?id=${id}` : ''
    callbackFetch(`${this.props.host}/json-comments${i}`, (error, res) => {
      this.setState({ loading: false })
      if (error) {
        return this.setState({ error })
      }
      const { 'comments': comments, csrf } = res.json()
      this.setState({ comments: [...comments, ...this.state.comments], csrf })
    }, {
      credentials: 'include',
    })
  }
  render() {
    const { error, loading, comments, csrf } = this.state
    if (error)
      return (<div>Error loading list: {error}</div>)
    if (loading)
      return (<div>Loading list...</div>)

    return <div className="CommentsList">
      {comments.map((comment) => {
        return <Item key={comment._id} comment={comment} csrf={csrf} host={this.props.host} onRemove={(id) => {
          this.setState({
            comments: this.state.comments.filter(({ _id }) => {
              return _id != id
            }),
          })
        }} />
      })}</div>
  }
}

const Login = ({ github_user }) => {
  if (!github_user) return null
  return (<span> (
    <a href={github_user.html_url}>{github_user.login}</a>)
  </span>)
}
/**
 * @param {Object} opts
 * @param {WebsiteComment} opts.comment
 */
const Item = ({ comment: { _id, country, isAuthor, name, photo, comment, date, github_user }, onRemove, csrf, host }) => {
  return (<div className="comment">
    <strong>{name || 'Anonymous'}</strong>{<Login github_user={github_user}/>}
    {country ? ` from ${country}`: ''}
    {' '}on <em>{new Date(date).toLocaleString()}</em> {isAuthor && <a href="#" onClick={(e) => {
      e.preventDefault()
      const c = confirm('Are you sure you want to delete comment?')
      if (c) {
        callbackFetch(`${host}/remove-comment?csrf=${csrf}&id=${_id}`, (error, res) => {
          if (error) return alert(error)
          const { error: er } = res.json()
          if (er) alert(er)
          else if (res) onRemove(_id)
        }, {
          credentials: 'include',
        })
      }
      return false
    }}>
      Remove
    </a>}
    <div className="LCommentBlock">
      {photo && <div>
        <img src={photo} />
      </div>}
      <div>
        {comment}
      </div>
    </div>
  </div>)
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../').WebsiteComment} WebsiteComment
 */