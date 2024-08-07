import { useState } from "react";
import { axiosInstance } from "loony-query";
import { Link, useNavigate } from "react-router-dom";

const handleSignUpError = (data) => {
  let errs = [];
  if (typeof data === "string") {
    return [data];
  }

  if (typeof data === "object") {
    for (let key in data) {
      let x = data[key][0];
      if (x.code && x.code === "length") {
        errs.push(`${key} length cannot be less then ${x.params.min}.`);
      } else {
        errs.push(x.code);
      }
    }
  }
  return errs;
};

const Signup = ({ isMobile }) => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const [signupError, setSignupError] = useState([]);
  const navigate = useNavigate();

  const signup = () => {
    if (!fname) {
      setSignupError(["Please enter your first name."]);
      return;
    }
    if (!email) {
      setSignupError(["Phone number is required."]);
      return;
    }
    if (!password) {
      setSignupError(["Please enter password."]);
      return;
    }
    const formData = {
      fname,
      lname,
      email,
      password,
    };
    axiosInstance
      .post("/auth/signup", formData)
      .then(({ data }) => {
        navigate("/login", {});
      })
      .catch((err) => {
        setSignupError(handleSignUpError(err.response.data));
      });
  };

  return (
    <div className="book-container">
      <div className="signup-body">
        <div
          style={{
            width: "90%",
            height: "90vh",
            display: "flex",
            flexDirection: "row",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {!isMobile ? (
            <div
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "80%",
                }}
              >
                {/* <img src={require('../../assets/images/login.png')} style={{ width: '100%' }} /> */}
              </div>
              <div style={{ marginBlock: 20 }}>
                <div style={{ fontWeight: "bold", fontSize: 32 }}>Loony</div>
              </div>
            </div>
          ) : null}
          <div
            style={{
              width: isMobile ? "94%" : "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 380,
                padding: 20,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h2 style={{ fontSize: 26, color: "#4da6ff" }}>Sign Up</h2>
              </div>
              {signupError.length > 0 ? (
                <div style={{ marginBottom: 24 }}>
                  {signupError.map((e, i) => {
                    return (
                      <div key={i} style={{ color: "red" }}>
                        * {e}
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <div className="input-container">
                <label htmlFor="fname">First Name</label>
                <input
                  id="fname"
                  type="text"
                  required
                  value={fname}
                  onChange={(e) => {
                    setFname(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      signup(e);
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="input-container">
                <label htmlFor="lname">Last Name</label>
                <input
                  id="lname"
                  type="text"
                  required
                  value={lname}
                  onChange={(e) => {
                    setLname(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      signup(e);
                    }
                  }}
                />
              </div>

              <div className="input-container">
                <label htmlFor="phone">Email or Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      signup(e);
                    }
                  }}
                />
              </div>

              <div className="input-container">
                <label htmlFor="password">Password</label>
                <input
                  type={viewPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      signup(e);
                    }
                  }}
                  required
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBlock: 10,
                  }}
                >
                  <input
                    style={{ width: 16, height: 16 }}
                    type="checkbox"
                    onChange={() => {
                      setViewPassword(!viewPassword);
                    }}
                  />
                  <span style={{ marginLeft: 10 }}>Show password</span>
                </div>
              </div>
              <button
                style={{ width: "100%" }}
                onClick={signup}
                className="btn-md blue-bg"
              >
                Sign Up
              </button>

              <div
                style={{
                  marginBlock: 10,
                  fontSize: 14,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <span style={{ color: "#6d6d6d" }}>
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  style={{ color: "rgb(15, 107, 228)", marginLeft: 5 }}
                >
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
