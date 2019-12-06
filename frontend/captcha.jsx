import Captcha from './Auth/Captcha'
import {
  FormGroup, Input,
} from '@depack/form'

const CaptchaFormGroup = ({ auth, host }) => {
  if (auth.github_user || auth.linkedin_user) return null
  return (<FormGroup form-row col-md-2 label="Captcha" help="Sign in to skip.">
    <Captcha col-sm-4 col-md-3 col-lg-2 host={host}/>
    <Input col-sm-4 col-md-3 name="captcha-answer" />
  </FormGroup>)
}

export default CaptchaFormGroup