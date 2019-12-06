import Form, {
  FormGroup, Input, TextArea, SubmitButton, SubmitForm, Select,
} from '@depack/form'
// import fetch from 'unfetch'
import { getUserData } from '../Auth/lib'
import callbackFetch from '../fetch'
import countries from '../countries'
import CaptchaFormGroup from '../captcha'

export default class CommentForm extends SubmitForm {
  constructor() {
    super()
    this.fetchOptions = { credentials: 'include' }
    this.state.npm = null
    this.state.npmFetchError = null
    this.npmInput = null
  }
  /**
   * @param {Object} [props]
   * @param {Auth} [props.auth]
   */
  render({ onChange, auth, host, ...props }) {
    const { formLoading, error, success, npmCount, npmFetchError, npmLoading } = this.state

    const { picture, name } = getUserData(auth)

    let npmHelp = 'Your NPM profile name.'
    if (npmLoading) npmHelp = `Fetching your packages....`
    let npmValidation
    if (npmCount) npmValidation = `You've made ${npmCount} packages.`
    else if (npmFetchError) npmValidation = `Error loading NPM: ${npmFetchError}`
    if (npmValidation) npmHelp = null

    return (<Form {...props} onSubmit={this.submit.bind(this)} onChange={values => {
      this.reset()
      if (onChange) onChange(values)
      this.setState({
        npmFetchError: null,
      })
      const { 'npm': npm } = values
      if (npm && this.state.npm != npm) {
        this.setState({
          npmLoading: true,
          npmFetchError: null,
          npmCount: null,
        })
        callbackFetch(`${host}/npm?user=${npm}`, (e, res) => {
          this.setState({
            npmLoading: false,
          })
          if (e) {
            return this.setState({
              npmFetchError: e,
              npmCount: null,
            })
          }
          const { 'error': err, 'count': count } = res.json()
          if (err) {
            return this.setState({
              npmFetchError: err,
              npmCount: count,
            })
          }
          this.setState({
            npmFetchError: null,
            npmCount: count,
          })
        })
      }
    }}>
      {picture && <Input type="hidden" name="photo" value={picture} />}
      <Input type="hidden" name="csrf" value={auth.csrf} />
      <FormGroup label="Name*" help="This will appear on the website"
        form-row col-2>
        <Input col-10 name="name" value={name} />
      </FormGroup>
      <FormGroup label="Country" help="Your residence country."
        form-row col-2>
        <Select col-10 name="country"
          defaultText="select country" options={countries.map(a => {
            return { value: a.code, title: a.name }
          })} />
      </FormGroup>
      <FormGroup details detailsClass="mb-3" label="Organisation" help="Where you work.">
        <Input name="org" placeholder="name" className="mb-1" />
        <Input name="url" type="url" placeholder="url" className="mb-1" />
        <Select name="org-size" className="mb-1"
          defaultText="select size" options={[
            { value: 'small', title: 'small (＜5 employees)' },
            { value: 'medium', title: 'medium (＜35 employees)' },
            { value: 'large', title: 'large (＜100 employees)' },
            { value: 'enterprise', title: 'enterprise' },
          ]} />
      </FormGroup>
      <FormGroup label="GitHub" help={auth.github_user ? 'GitHub username, sign out to remove.' : 'Please sign in with GitHub to fill in and verify automatically.'} form-row col-2>
        <Input col-10 name="github" disabled value={auth.github_user ? auth.github_user.html_url : undefined}/>
      </FormGroup>
      <FormGroup label="NPM" help={auth.github_user ? npmHelp : 'To add and validate your NPM, sign in with GitHub and make sure your NPM profile page links to it (<a href="https://www.npmjs.com/settings/USERNAME/profile" target="_blank">NPM Settings</a>).'} form-row col-2 invalid={npmFetchError} valid={npmCount}>
        <Input col-10 name="npm" help={npmValidation} valid={npmCount} disabled={!auth.github_user} invalid={npmFetchError} ref={(i) => {
          this.npmInput = i
        }} onInput={(e) => {
          const value = e.currentTarget.value
          if (!npmFetchError) return
          this.setState({
            npmFetchError: null,
          }, () => {
            e.currentTarget.value = value
          })
        }}/>
      </FormGroup>
      <FormGroup form-row col-2 label="Title" help="E.g., Senior Software Engineer">
        <Input col-10 name="title" />
      </FormGroup>
      <FormGroup label="Experience" help="How many years of experience you have" form-row col-md-2>
        <Input col-md-10 name="experience" placeholder="e.g., 3" />
      </FormGroup>
      <FormGroup label="Comment" help="Any additional information">
        <TextArea name="comment" />
      </FormGroup>
      <CaptchaFormGroup host={host} auth={auth} />
      <SubmitButton loading={formLoading} type="warning"
        confirmText="Submit Data" />
      {error && `Error: ${error}`}
      {success && `Comment has been submitted!`}
    </Form>)
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../..').Auth} Auth
 */
