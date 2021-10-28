import { useState, useContext } from 'react'
import { useSkin } from '@hooks/useSkin'
import { Facebook, GitHub, Mail, Twitter } from 'react-feather'
import { Link } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
// ** Configs
import themeConfig from '@configs/themeConfig'
import { Button, CardText, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row, Alert } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import { loginWithEmailAndPassword, logoutUser } from '../utility/RealmApolloClient'
import { FiltersContext } from '../context/FiltersContext/FiltersContext'
import { getUserData } from '../utility/Utils'

const Login = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { coordinatorFilterContext, setCoordinatorFilterContext } = useContext(FiltersContext)

  const setDefaultFilters = (userData) => {
    if (userData && userData.customData && userData.customData.coordinatorId)
      setCoordinatorFilterContext({
        type: 'coordinator',
        value: [userData.customData.coordinatorId],
        label: [userData.customData.name]
      })
  }

  const submitHandler = async (event) => {
    event.preventDefault()
    if (event.target.email.value && event.target.password.value) {
      try {
        setLoading(true)
        setError(false)
        await loginWithEmailAndPassword(event.target.email.value, event.target.password.value)
        const userData = getUserData()
        if (!userData || !userData.customData || !userData.customData.role) {
          await logoutUser()
          setError(true)
        } else {
          setDefaultFilters(userData)
          setLoading(false)
          props.history.push('/')
        }
      } catch (ex) {
        setLoading(false)
        setError(true)
      }
    }
  }

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img src={themeConfig.app.appLogoImage} alt="logo" className="img-fluid" />
          </div>
        </Col>
        <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="font-weight-bold mb-1">
              Welcome to TeamClass
            </CardTitle>
            <CardText className="mb-2">Please sign-in to your account.</CardText>
            <Form className="auth-login-form mt-2" onSubmit={(e) => submitHandler(e)}>
              <FormGroup>
                <Label className="form-label" for="email">
                  Email
                </Label>
                <Input type="email" id="email" name="email" placeholder="john@example.com" autoFocus />
              </FormGroup>
              <FormGroup>
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="password">
                    Password
                  </Label>
                  {/*<Link to="/">
                    <small>Forgot Password?</small>
                    </Link> */}
                </div>
                <InputPasswordToggle className="input-group-merge" id="password" name="password" />
              </FormGroup>
              <FormGroup>
                <CustomInput type="checkbox" className="custom-control-Primary" id="remember-me" label="Remember Me" />
              </FormGroup>
              <Button.Ripple type="submit" color="primary" block>
                Sign in
              </Button.Ripple>
              {error && (
                <Alert color="danger">
                  <p className="m-1">Wrong email / password.</p>
                </Alert>
              )}
            </Form>
            {/*<p className="text-center mt-2">
              <span className="mr-25">New on our platform?</span>
              <Link to="/">
                <span>Create an account</span>
              </Link>
            </p>
            <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button.Ripple color="facebook">
                <Facebook size={14} />
              </Button.Ripple>
              <Button.Ripple color="twitter">
                <Twitter size={14} />
              </Button.Ripple>
              <Button.Ripple color="google">
                <Mail size={14} />
              </Button.Ripple>
              <Button.Ripple className="mr-0" color="github">
                <GitHub size={14} />
              </Button.Ripple></div>*/}
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
