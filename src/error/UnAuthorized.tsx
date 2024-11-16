import { Link } from 'react-router-dom'

const AuthError = () => {
  return (
    <div style={{ width: '80%', marginLeft: '20%' }}>
      <h1>UnAuthorized</h1>
      <Link to="/login" style={{ color: 'rgb(15, 107, 228)', marginLeft: 5 }}>
        Login
      </Link>
    </div>
  )
}

export default AuthError
