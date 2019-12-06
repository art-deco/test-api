import { Component } from 'preact'
import fetch from 'unfetch'

export default class Captcha extends Component {
  async componentDidMount() {
    this.setState({ loading: true })
    try {
      const res = await fetch(`${this.props.host}/captcha`)
      const { 'error': error, 'data': data, 'hash': hash } = await res.json()
      if (error) this.setState({ error })
      else this.setState({ data, hash })
    } catch (error) {
      this.setState({ error })
    } finally {
      this.setState({ loading: false })
    }
  }
  render({ invalid, valid, ...props }) {
    const { data, hash } = this.state
    if (!data) return null

    const { colClasses } = getClasses(props)
    const c = [
      invalid ? 'is-invalid' : null,
      valid ? 'is-valid' : null,
      ...colClasses,
    ]
      .filter(Boolean).join(' ')

    return (<div className={c}>
      <span dangerouslySetInnerHTML={{ __html: data }}></span>
      <input type="hidden" name="captcha" value={hash} />
    </div>)
  }
}

const getClasses = (props) => {
  const colClasses = []
  const prop = Object.entries(props).reduce((acc, [key, value]) => {
    if (key == 'col' || key.startsWith('col-')) {
      colClasses.push(key)
      return acc
    }
    acc[key] = value
    return acc
  }, {})
  return { colClasses, prop }
}