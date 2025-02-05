import { useEffect, useState, useContext } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import imgLogo from '../../assets/images/auth/img_logo.png'
import imgLogin from '../../assets/images/auth/img_login.png'
import { fetchRawData } from '../../components/FetchData'
import { ActivateUserUrl } from '../../services/ApiUrls'
import '../../styles/style.css'
import { UserContext } from '../../context/UserContext'

declare global {
  interface Window {
    google: any
    gapi: any
  }
}

export default function ActivateUser () {
  const navigate = useNavigate()
  const [token, setToken] = useState(false)

  const [passwordValue, setPasswordValue] = useState('')
  const [passwordRepeatValue, setPasswordRepeatValue] = useState('')

  const { uid, user_token, user_token_delta } = useParams()
  
  const handlePasswordChange = (event: any) => {
    setPasswordValue(event.target.value)
  }
  
  const handlePasswordRepeatChange = (event: any) => {
    setPasswordRepeatValue(event.target.value)
  }

  const userCtx = useContext(UserContext)
  
  const head = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
  
  const handleCreatePassword = (event: any) => {
    if (passwordValue !== passwordRepeatValue) {
      alert('Passwords do not match!')
      return
    }
    // clear any data related to user role
    userCtx.setUser({ email: '', role: '', organization: '' })
    fetchRawData(`${ActivateUserUrl}/`, 'POST', JSON.stringify({ uid, user_token, user_token_delta, password: passwordValue }), head)
        .then((res: any) => {
          if (!res.ok) {
            throw Error('User not found or activation_key is not valid') 
          }
          return res.json()
        })
        .then((res: any) => {
          alert('User is activated!')
          navigate('/app')
        })
        .catch((error: any) => {
          console.error('Error:', error)
          alert(error)
        })
  }
  
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
              CREATE PASSWORD
            </Typography>
            <Grid>
              <Typography style={{ 
                fontStyle: 'italic',
                justifyContent: 'center',
                marginTop: '10px'
                }} variant="body2">
                Create password for your account
              </Typography>
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
                value={passwordRepeatValue}
                onChange={handlePasswordRepeatChange}
                  type="password"
                  placeholder="Repeat password"
                  className="input mt-4"
                />
              </div>
              <div>
                <button
                  onClick={handleCreatePassword}
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
                  Create password
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
              </Typography>
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
