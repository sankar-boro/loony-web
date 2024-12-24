import { useContext, useState } from 'react'
import { axiosInstance } from 'loony-api'
import { AuthContext } from '../context/AuthContext.tsx'
import { Link, useNavigate } from 'react-router-dom'
import { AuthStatus, NotificationContextProps } from 'loony-types'
import { handleError } from 'loony-api'

const Login = ({
  isMobile,
  notificationContext,
}: {
  isMobile: boolean
  notificationContext: NotificationContextProps
}) => {
  const [state, setState] = useState({
    username: '',
    password: '',
  })

  const [viewPassword, setViewPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const onLogin = () => {
    if (!state.username) {
      setLoginError('email is required.')
      return
    }
    if (!state.password) {
      setLoginError('Password is required.')
      return
    }

    const formData = {
      email: state.username,
      password: state.password,
    }
    axiosInstance
      .post('/auth/login', formData)
      .then(({ data }) => {
        authContext.setAuthContext({
          status: AuthStatus.AUTHORIZED,
          user: data,
        })
        navigate('/', {})
      })
      .catch((err) => {
        const __err = handleError(err)
        notificationContext.setNotificationContext((prevState) => ({
          ...prevState,
          alert: {
            title: 'Error',
            content: __err,
            status: '',
          },
        }))
      })
  }

  return (
    <div className="book-container">
      <div className="login-body">
        <div
          style={{
            width: '90%',
            height: '90vh',
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {!isMobile ? (
            <div
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '80%',
                }}
              >
                {/* <img src={require('../../assets/images/login.png')} style={{ width: '100%' }} /> */}
              </div>
              <div style={{ marginBlock: 20 }}>
                <div style={{ fontWeight: 'bold', fontSize: 32 }}>Loony</div>
              </div>
            </div>
          ) : null}
          <div
            style={{
              width: isMobile ? '94%' : '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 380,
                padding: 20,
                borderRadius: 10,
              }}
              className="box-shadow-1"
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <h2 style={{ fontSize: 26, color: '#4da6ff' }}>Log in</h2>
              </div>

              {loginError ? (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ color: 'red' }}>{loginError}</div>
                </div>
              ) : null}

              <div className="input-container">
                <label htmlFor="phone">Email/Username</label>
                <input
                  name="username"
                  type="text"
                  value={state.username}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onLogin()
                    }
                  }}
                  required
                  autoFocus
                />
              </div>

              <div className="input-container">
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type={viewPassword ? 'text' : 'password'}
                  value={state.password}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onLogin()
                    }
                  }}
                  required
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBlock: 10,
                  }}
                >
                  <input
                    style={{ width: 16, height: 16 }}
                    type="checkbox"
                    onChange={() => {
                      setViewPassword(!viewPassword)
                    }}
                  />
                  <span style={{ marginLeft: 10 }}>Show password</span>
                </div>
              </div>

              <button
                style={{ width: '100%', marginTop: 30 }}
                onClick={onLogin}
                className="btn-md blue-bg"
              >
                Log In
              </button>
              <div
                style={{
                  marginBlock: 10,
                  fontSize: 14,
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <span style={{ color: '#6d6d6d' }}>Dont have an account? </span>
                <Link
                  to="/signup"
                  style={{ color: 'rgb(15, 107, 228)', marginLeft: 5 }}
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
