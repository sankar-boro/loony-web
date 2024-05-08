import { useState } from 'react';
import { axiosInstance } from '../query';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [request, setRequest] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (username && password) {
      const formData = {
        username,
        password,
      };
      axiosInstance
        .post('/auth/login', formData)
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {});
    }
  };
  return (
    <div className='book-container'>
      <div className='login-body'>
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
          <div
            style={{
              width: '50%',
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
              className='box-shadow-1'
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
              <div className='input-container'>
                <label htmlFor='phone'>Phone Number</label>
                <input
                  type='number'
                  min='0'
                  id='phone'
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      login(e);
                    }
                  }}
                  required
                  autoFocus
                />
              </div>

              <div className='input-container'>
                <label htmlFor='password'>Password</label>
                <input
                  type={viewPassword ? 'text' : 'password'}
                  id='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      login(e);
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
                    type='checkbox'
                    onChange={() => {
                      setViewPassword(!viewPassword);
                    }}
                  />
                  <span style={{ marginLeft: 10 }}>Show password</span>
                </div>
              </div>

              <button
                style={{ width: '100%', marginTop: 30 }}
                onClick={login}
                className='btn-md blue-bg'
                disabled={request === true ? true : false}
              >
                {request === true ? 'Signing in...' : 'Sign in'}
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
                <span onClick={() => {}} className='hover'>
                  <a href='/signup' style={{ color: 'rgb(15, 107, 228)', marginLeft: 5 }}>
                    Create Account
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
