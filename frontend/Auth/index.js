import { Component } from 'preact'
import callbackFetch from '../fetch'

/**
 * Fetches authorisation data from the server.
 */
export default class App extends Component {
  constructor() {
    super()

    this.state = {
      loading: true,
      error: null,
      /** @type {!Auth} */
      auth: {},
    }
    this.pml = /** @type {function(!Event)} */(this.postMessageListener.bind(this))

    window.addEventListener('message', this.pml, false)
  }
  componentDidMount() {
    this.auth()
  }
  auth() {
    this.setState({ loading: true })
    callbackFetch(`${this.props.host}/auth`, (error, res) => {
      this.setState({ loading: false })
      if (error) {
        return this.setState({ error })
      }
      const auth = res.json()
      this.setState({ auth })
    }, {
      credentials: 'include',
    })
  }
  /**
   * @param {!MessageEvent} event
   */
  postMessageListener(event) {
    const { data, origin } = event
    if (origin != this.props.host) return
    if (data == 'signedin') this.auth()
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.pml)
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../..').Auth} Auth
 */
