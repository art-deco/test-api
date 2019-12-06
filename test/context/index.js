import { equal } from 'zoroaster'
import { aqt } from 'rqt'
import Server from '../../src/server'

export default class Context {
  async _init() {
    const { app, url } = await Server({
      port: 0,
      client_id: 'test',
      client_secret: 'test',
      watch: false,
    })
    this.app = app
    this.url = url
  }
  async _destroy() {
    if (this.app) await this.app.destroy()
  }
  async ping(path) {
    const r = `${this.url}${path}`
    const { statusCode } = await aqt(r, { justHeaders: true })
    equal(statusCode, 200)
  }
  setClient(client) {
    this.app.context.client = client
  }
}