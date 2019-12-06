import { equal } from 'zoroaster'
import { aqt } from 'rqt'
import Context from '../context'

/** @type {Object.<string, (c: Context)>} */
const TS = {
  context: Context,
  async 'has /comments route'({ ping }) {
    await ping('/comments')
  },
  async 'has /reflex.jpg route'({ ping }) {
    await ping('/reflex.jpg')
  },
  async 'has /counter.svg route'({ ping, setClient }) {
    setClient({
      async search() {
        return { aggregations: {
          distinct_ips: { value: 10 },
        } }
      },
      async create() {},
    })
    await ping('/counter.svg')
  },
  async 'has /linkedin1 route for users'({ url }) {
    const { statusCode } = await aqt(`${url}/linkedin1`, { justHeaders: 1 })
    equal(statusCode, 302)
  },
  async 'has /linkedin1 route for LinkedIn'({ url }) {
    const { statusCode } = await aqt(`${url}/linkedin1`, { justHeaders: 1, headers: { 'user-agent': 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)' } })
    equal(statusCode, 200)
  },
}

export default TS