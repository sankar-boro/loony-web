import { useContext, useState } from 'react'
import { axiosInstance } from 'loony-query'
import { AuthContext } from '../context/AuthContext.tsx'
import { Link, useNavigate } from 'react-router-dom'
import { AuthStatus } from 'loony-types'

const handleLoginError = (err: any): string[] => {
  const errs: string[] = []
  if (typeof err === 'string') {
    return [err]
  }

  if (typeof err === 'object') {
    if (err && err.response && err.response.data) {
      return [err.response.data]
    }
  }
  return errs
}

const Login = ({ isMobile }: { isMobile: boolean }) => {
  const [email, setemail] = useState('')
  const [password, setPassword] = useState('')
  const [viewPassword, setViewPassword] = useState(false)
  const [loginError, setLoginError] = useState<string[]>([])
  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const onLogin = () => {
    if (!email) {
      setLoginError(['email is required.'])
      return
    }
    if (!password) {
      setLoginError(['Password is required.'])
      return
    }
    const formData = {
      email,
      password,
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
        setLoginError(handleLoginError(err))
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

              {loginError.length > 0 ? (
                <div style={{ marginBottom: 24 }}>
                  {loginError.map((e, i) => {
                    return (
                      <div key={i} style={{ color: 'red' }}>
                        * {e}
                      </div>
                    )
                  })}
                </div>
              ) : null}

              <div className="input-container">
                <label htmlFor="phone">Email/Username</label>
                <input
                  type="text"
                  id="phone"
                  value={email}
                  onChange={(e) => {
                    setemail(e.target.value)
                  }}
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
                  type={viewPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
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
