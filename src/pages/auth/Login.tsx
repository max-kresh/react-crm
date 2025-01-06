import { useEffect, useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import imgGoogle from '../../assets/images/auth/google.svg'
import imgLogo from '../../assets/images/auth/img_logo.png'
import imgLogin from '../../assets/images/auth/img_login.png'
import { GoogleButton } from '../../styles/CssStyled'
import { fetchData, fetchRawData } from '../../components/FetchData'
import { AuthUrl, AuthEmailUrl, AppSettingsUrl } from '../../services/ApiUrls'

import '../../styles/style.css'

declare global {
  interface Window {
    google: any
    gapi: any
  }
}

export default function Login () {
  const navigate = useNavigate()
  const [token, setToken] = useState(false)
  const [google_login_allowed, set_google_login_allowed] = useState(true)

  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const handleEmailChange = (event: any) => {
    setEmailValue(event.target.value)
  }
  
  const handlePasswordChange = (event: any) => {
    setPasswordValue(event.target.value)
  }
  
  const head = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
  
  const handleLogin = (event: any) => {
    fetchRawData(`${AuthEmailUrl}/`, 'POST', JSON.stringify({ email: emailValue, password: passwordValue }), head)
        .then((res: any) => {
          if (!res.ok) {
            throw Error('Incorrect password or user not found') 
          }
          return res.json()
        })
        .then((res: any) => {
          localStorage.setItem('Token', 'Bearer ' + res.access_token)
          setToken(true)
        })
        .catch((error: any) => {
          console.error('Error:', error)
          alert(error)
        })
  }

  useEffect(() => {
    if (localStorage.getItem('Token')) {
      // navigate('/organization')
      navigate('/app')
    }
  }, [token])

  useEffect(() => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    fetchData(`${AppSettingsUrl}/`, 'GET', null as any, Header)
    .then((res) => {
      if (!res.error && res.length > 0) {
        let settings = res.filter((s: any) => s.name === 'allow_google_login')
        if (settings.length > 0) {
          console.log(settings[0].value)
          set_google_login_allowed(settings[0].value === 'True')
        }
      }
    })
  }, [])

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const apiToken = { token: tokenResponse.access_token }

      fetchData(`${AuthUrl}/`, 'POST', JSON.stringify(apiToken), head)
        .then((res: any) => {
          if (res.error) {
            throw Error(res.message)
          } else {
            localStorage.setItem('Token', `Bearer ${res.access_token}`)
            setToken(true)          
          }
        })
        .catch((error: any) => {
          console.error('Error:', error)
          alert(error)
        })
    }
  })
  return (
    <div>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100%', width: '100%', position: 'fixed' }}
      >
        <Grid
          container
          item
          xs={8}
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
          sx={{ height: '100%', overflow: 'hidden' }}
        >
          <Grid item sx={{ 
              mt: 2,
              border: '3px solid',
              padding: '30px',
              borderRadius: '10px',
              boxShadow: '0 0 10px #000000',
              borderColor: 'primary.main',
              background: 'linear-gradient(to top, #4980FF, #ffffff)',
              width: '50%',
              textAlign: 'center',
              justifyItems: 'center'
               }}>
            <Grid sx={{ mt: 2 }}>
              <img
                src={imgLogo}
                alt="register_logo"
                className="register-logo"
              />
            </Grid>
            <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
              Sign In
            </Typography>
            <Grid>
              <Typography style={{ 
                fontStyle: 'italic',
                justifyContent: 'center',
                marginTop: '10px'
                }} variant="body2">
                Sign in with your email
              </Typography>
              <div>
                <input
                  style={{ 
                    marginTop: '15px',
                    border: '1px solid',
                    padding: '10px',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px #000000',
                    borderColor: 'primary.main'
                  }}
                  value={emailValue}
                  onChange={handleEmailChange}
                  type="text"
                  placeholder="Email"
                  className="input"
                />
              </div>
              <div >
                <input
                style={{ 
                  marginTop: '15px',
                  border: '1px solid',
                  padding: '10px',
                  borderRadius: '10px',
                  boxShadow: '0 0 10px #000000',
                  borderColor: 'primary.main'
                }}
                value={passwordValue}
                onChange={handlePasswordChange}
                  type="password"
                  placeholder="Password"
                  className="input mt-4"
                />
              </div>
              <div>
                <button
                  onClick={handleLogin}
                  style={{ 
                    marginTop: '25px',
                    width: '80%',
                    border: '1px solid black',
                    padding: '10px',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px #000000',
                    borderColor: 'primary.main',
                    backgroundColor: 'blue',
                    color: 'white'
                  }}
                >
                  Login
                </button>
              </div>
            </Grid>
            <Grid item sx={{ mt: 4 }}>
            <Typography style={{ 
                fontStyle: 'italic',
                justifyContent: 'center',
                marginTop: '15px',
                marginBottom: '10px'
                }} variant="body2">
                {google_login_allowed && <p>Or</p>} 
              </Typography>
              {/* <GoogleLogin
                                onSuccess={credentialResponse => {
                                    console.log(credentialResponse);
                                }}

                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                            <Button onClick={signout}>logout</Button> */}
              {google_login_allowed && 
              <GoogleButton
                variant="outlined"
                onClick={() => login()}
                sx={{ fontSize: '12px', fontWeight: 500, border: '1px solid black', boxShadow: '0 0 10px rgba(0,0,0)' }}
              >
                Sign in with Google
                <img
                  src={imgGoogle}
                  alt="google"
                  style={{ width: '17px', marginLeft: '5px' }}
                />
              </GoogleButton>}
              {/* <Grid item sx={{ mt: 2, alignItems: 'center', alignContent: 'center' }}>
                                <Grid item sx={{ mt: 1, ml: 6 }}>
                                    <div className='authentication_wrapper'>
                                        <div className='authentication_block'>
                                            <div className='buttons'>
                                                <GoogleLogin
                                                    onSuccess={credentialResponse => {
                                                        console.log(credentialResponse);
                                                    }}

                                                    onError={() => {
                                                        console.log('Login Failed');
                                                    }}

                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid> */}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={8}
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="rightBg"
          sx={{ height: '100%', overflow: 'hidden', justifyItems: 'center' }}
        >
          <Grid item>
            <Stack sx={{ alignItems: 'center' }}>
              <h3>Welcome to BottleCRM</h3>
              <p> Free and OpenSource CRM from small medium business.</p>
              <img
                src={imgLogin}
                alt="register_ad_image"
                className="register-ad-image"
              />
              <footer className="register-footer">bottlecrm.com</footer>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </div>
  )
}
