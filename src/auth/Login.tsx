import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NotificationContextProps } from 'loony-types'
import { onLogin } from 'loony-api'
import { AuthContext } from '../context/AuthContext.tsx'

const Login = ({
  isMobile,
  notificationContext,
}: {
  isMobile: boolean
  notificationContext: NotificationContextProps
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [viewPassword, setViewPassword] = useState(false)
  const [formError, setFormError] = useState({
    label: '',
    message: '',
  })

  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onHandleLogin = () => {
    setFormError({ label: '', message: '' })
    onLogin({
      formData,
      setFormError,
      authContext,
      notificationContext,
      navigate,
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
                <h2>Log in</h2>
              </div>

              <div className="input-container">
                <label htmlFor="phone">Email/Username</label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onHandleLogin()
                    }
                  }}
                  required
                  autoFocus
                />

                {formError.label === 'username' ? (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ color: 'red' }}>{formError.message}</div>
                  </div>
                ) : null}
              </div>

              <div className="input-container">
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type={viewPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onHandleLogin()
                    }
                  }}
                  required
                />

                {formError.label === 'password' ? (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ color: 'red' }}>{formError.message}</div>
                  </div>
                ) : null}
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
                onClick={onHandleLogin}
                className="shadow black-bg"
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
