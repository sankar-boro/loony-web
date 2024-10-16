import { MenuNavContainer } from "../components/Containers.tsx";
import { MdHistory } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { IoMdTime } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";

import contentPolicy from '../assets/svgs/ContentPolicy.svg';
import privacyPolicy from '../assets/svgs/PrivacyPolicy.svg';
import userAgreement from '../assets/svgs/UserAgreement.svg';

export default function Navbar() {
  return (
    <div style={{ width: "15%", paddingTop: 10 }}>
      <div style={{ width: "90%", paddingLeft: "5%", paddingRight: "5%" }}>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: "relative", top: 3 }}>
            <GoHome size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">Home</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: "relative", top: 3 }}>
            <MdHistory size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">History</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: "relative", top: 3 }}>
            <IoMdTime size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">Read Later</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, position: "relative", top: 3 }}>
            <AiOutlineLike size={20} color="#2d2d2d" />
          </span>
          <div className="page-nav-title">Likes</div>
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
            <img src={contentPolicy} />
          </span>
          <div className="page-nav-title">Content Policy</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, height: 16, width: 16 }}>
          <img src={privacyPolicy} />
          </span>
          <div className="page-nav-title">Privacy Policy</div>
        </MenuNavContainer>
        <MenuNavContainer>
          <span style={{ marginRight: 10, height: 16, width: 16 }}>
            <img src={userAgreement} />
          </span>
          <div className="page-nav-title">User Agreement</div>
        </MenuNavContainer>
      </div>
    </div>
  );
}
