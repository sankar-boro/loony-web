import { Link } from 'react-router-dom'
import { MdHistory } from 'react-icons/md'
import { GoHome } from 'react-icons/go'
import { IoMdTime } from 'react-icons/io'
import { AiOutlineLike } from 'react-icons/ai'
import ContentPolicyIcon from '../assets/svgs/ContentPolicy.svg'
import PrivacyPolicyIcon from '../assets/svgs/PrivacyPolicy.svg'
import UserAgreementIcon from '../assets/svgs/UserAgreement.svg'

import { BasicMenuNavContainer } from '../components/Containers.tsx'

export default function Navbar() {
  return (
    <div style={{ width: '15%', paddingTop: 10 }}>
      <div style={{ width: '95%', paddingLeft: '2%', paddingRight: '2%' }}>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <GoHome size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">Home</div>
        </BasicMenuNavContainer>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <MdHistory size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">History</div>
        </BasicMenuNavContainer>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <IoMdTime size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">Read Later</div>
        </BasicMenuNavContainer>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, position: 'relative', top: 3 }}>
            <AiOutlineLike size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">Likes</div>
        </BasicMenuNavContainer>
        <hr />
        <BasicMenuNavContainer>
          <span
            style={{
              marginRight: 10,
              height: 16,
              width: 16,
            }}
          >
            <ContentPolicyIcon />
          </span>
          <div className="page-nav-title">
            <Link to={`/policies/ContentPolicy`}>Content Policy</Link>
          </div>
        </BasicMenuNavContainer>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, height: 16, width: 16 }}>
            <PrivacyPolicyIcon />
          </span>
          <div className="page-nav-title">
            <Link to={`/policies/PrivacyPolicy`}>Privacy Policy</Link>
          </div>
        </BasicMenuNavContainer>
        <BasicMenuNavContainer>
          <span style={{ marginRight: 10, height: 16, width: 16 }}>
            <UserAgreementIcon />
          </span>
          <div className="page-nav-title">
            <Link to={`/policies/UserAgreement`}>User Agreement</Link>
          </div>
        </BasicMenuNavContainer>
      </div>
    </div>
  )
}
