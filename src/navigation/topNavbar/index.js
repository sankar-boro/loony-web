/* eslint-disable react-hooks/exhaustive-deps */
import { LuMenu } from "react-icons/lu";
import { LiaUserSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useContext } from "react";
import { AUTHORIZED, UNAUTHORIZED } from "loony-types";
import { AuthContext } from "../../context/AuthContext";
import { axiosInstance } from "loony-query";

const Logo = () => {
  return (
    <Link className="nav-item" to="/" style={{ color: "white" }}>
      LOONY
    </Link>
  );
};

const CreateDocument = ({ auth }) => {
  if (auth.status === AUTHORIZED) {
    return (
      <div className="create-button">
        <button style={{ fontWeight: "bold" }}>Create</button>
        <div className="dropdown-content">
          <div className="dropdown-content-items">
            <div className="nav-list-items">
              <ul>
                <li>
                  <Link to="/create/book">Create Book</Link>
                </li>
                <li>
                  <Link to="/create/blog">Create Blog</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const Profile = ({ auth, logoutUser, navigate }) => {
  if (auth.status === AUTHORIZED) {
    return (
      <div className="profile-button">
        <LiaUserSolid size={32} />
        <div className="profile-content">
          <div className="profile-content-items">
            <div className="nav-list-items">
              <ul>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="#" onClick={logoutUser}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        style={{ fontWeight: "bold" }}
        onClick={() => {
          navigate("/login", { replace: true });
        }}
      >
        Login
      </button>
    </div>
  );
};
const Navigation = ({ auth, setMobileNavOpen, isMobile }) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const logoutUser = useCallback(() => {
    axiosInstance.post("/auth/logout").then(() => {
      authContext.setAuthContext({
        status: UNAUTHORIZED,
        user: null,
      });
    });
  }, []);

  return (
    <div className="top-navbar">
      <div className="top-navbar-container">
        <div className="flex-row">
          <div className="con-50 flex-center">
            {isMobile ? (
              <div className="nav-menu-btn">
                <LuMenu
                  color="white"
                  size={32}
                  onClick={() => {
                    setMobileNavOpen((prevState) => !prevState);
                  }}
                  style={{ marginRight: 10 }}
                />
              </div>
            ) : null}
            <div className="logo">
              <Logo setMobileNavOpen={setMobileNavOpen} isMobile={isMobile} />
            </div>
          </div>
          <div className="con-50 flex-end">
            <div className="app-menu">
              <CreateDocument auth={auth} />
            </div>
            <div className="app-menu">
              <Profile
                auth={auth}
                logoutUser={logoutUser}
                navigate={navigate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
