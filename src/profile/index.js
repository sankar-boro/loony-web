import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const { fname, lname } = auth.user;
  return (
    <div className='book-container'>
      <div style={{ backgroundColor: '#ccc', height: 100, padding: 24 }}>
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            top: 70,
          }}
        >
          {fname} {lname}
        </div>
      </div>
    </div>
  );
};

export default Profile;
