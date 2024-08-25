import { Link } from 'react-router-dom';
import { MdHistory } from 'react-icons/md';
import { GoHome } from 'react-icons/go';
import { IoMdTime } from 'react-icons/io';
import { AiOutlineLike } from 'react-icons/ai';
import { ContentPolicy, PrivacyPolicy, UserAgreement } from '../assets/css/icons';
import { MenuNavContainer } from '../components/Containers';

export default function Navbar() {
  return (
    <div style={{ width: '15%', paddingTop: 10 }}>
      <div style={{ width: '90%', paddingLeft: '5%', paddingRight: '5%' }}>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <GoHome size={20} color='#2d2d2d' />
          </span>
          <div className='page-nav-title'>Home</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <MdHistory size={20} color='#2d2d2d' />
          </span>
          <div className='page-nav-title'>History</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <IoMdTime size={20} color='#2d2d2d' />
          </span>
          <div className='page-nav-title'>Read Later</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <AiOutlineLike size={20} color='#2d2d2d' />
          </span>
          <div className='page-nav-title'>Likes</div>
        </MenuNavContainer>
        <hr />
        <MenuNavContainer>
          <span
            style={{
              marginRight: 10,
              height: 16,
              width: 16,
            }}
          >
            <ContentPolicy />
          </span>
          <div className='page-nav-title'>
            <Link to={`/ContentPolicy`}>Content Policy</Link>
          </div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, height: 16, width: 16 }}>
            <PrivacyPolicy />
          </span>
          <div className='page-nav-title'>
            <Link to={`/PrivacyPolicy`}>Privacy Policy</Link>
          </div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, height: 16, width: 16 }}>
            <UserAgreement />
          </span>
          <div className='page-nav-title'>
            <Link to={`/UserAgreement`}>User Agreement</Link>
          </div>
        </MenuNavContainer>
      </div>
    </div>
  );
}
