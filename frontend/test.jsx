import { render, Component } from 'preact'

class Container extends Component {
  constructor() {
    super()
    this.state = { state: 'initial' }
  }

  render() {
    const { children } = this.props
    const { state } = this.state
    return (
      <div>
        <button onClick={() => {
          this.setState({ state: 'updated' })
        }} >Update</button>
        <div>Container state: {state}</div>
        {children}
      </div>
    )
  }
}

const App = () => (
  <Container>
    <div>App</div>
    <div>
      →
      <span dangerouslySetInnerHTML={{ __html: '<u>HTML</u>' }} />
      ←
    </div>
  </Container>
)

render(<App />, window.document.body)
