import { useState } from 'react';
import { axiosInstance } from '../query';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [viewPassword, setViewPassword] = useState(false);

  const signup = () => {
    if (fname && lname && username && password) {
      const formData = {
        fname,
        lname,
        username,
        password,
      };
      axiosInstance
        .post('/auth/signup', formData)
        .then(({ data }) => {})
        .catch((err) => {});
    }
  };

  return (
    <div className='book-container'>
      <div className='signup-body'>
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
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <h2 style={{ fontSize: 26, color: '#4da6ff' }}>Sign Up</h2>
              </div>
              <div className='input-container'>
                <label htmlFor='fname'>First Name</label>
                <input
                  id='fname'
                  required
                  value={fname}
                  onChange={(e) => {
                    setFname(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      signup(e);
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className='input-container'>
                <label htmlFor='lname'>Last Name</label>
                <input
                  id='lname'
                  required
                  value={lname}
                  onChange={(e) => {
                    setLname(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      signup(e);
                    }
                  }}
                />
              </div>

              <div className='input-container'>
                <label htmlFor='phone'>Phone Number</label>
                <input
                  id='phone'
                  type='number'
                  min='0'
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      signup(e);
                    }
                  }}
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
                      signup(e);
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
              <button style={{ width: '100%' }} onClick={signup} className='btn-md blue-bg'>
                Sign Up
              </button>

              <div
                style={{
                  marginBlock: 10,
                  fontSize: 14,
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <span style={{ color: '#6d6d6d' }}>Already have an account? </span>
                <Link to='/login' style={{ color: 'rgb(15, 107, 228)', marginLeft: 5 }}>
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
