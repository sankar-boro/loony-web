import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "loony-query";
import CardLoader from "../components/CardLoader";
import { timeAgo } from "loony-utils";

const Profile = ({ isMobile }) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const { fname, lname, user_id } = auth.user;

  return (
    <div className="book-container flex-row">
      {!isMobile ? <Navbar /> : null}
      <div
        style={{
          width: isMobile ? "100%" : "85%",
          padding: isMobile ? "16px 0px" : 24,
        }}
      >
        <div
          className="profile-info"
          style={{
            width: isMobile ? "90%" : "90%",
            height: 150,
            paddingLeft: isMobile ? "5%" : "5%",
            paddingRight: isMobile ? "5%" : "5%",
          }}
        >
          <div
            className="flex-row"
            style={{
              marginTop: 5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              className="avatar"
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#ccc",
                borderRadius: 80,
                marginRight: 10,
              }}
            ></div>
            <div style={{ fontSize: 12 }}>
              <div className="username">
                {fname} {lname}
              </div>
            </div>
          </div>
        </div>
        <hr style={{ marginTop: 25, marginBottom: 25, width: "90%" }} />
        <div
          style={{
            width: isMobile ? "100%" : "90%",
            paddingLeft: isMobile ? "0%" : "5%",
            paddingRight: isMobile ? "0%" : "5%",
          }}
        >
          <Blogs user_id={user_id} navigate={navigate} isMobile={isMobile} />
          <Books user_id={user_id} navigate={navigate} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
};

const Blogs = ({ navigate, isMobile, user_id }) => {
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/blog/get/${user_id}/user_blogs`).then(({ data }) => {
      setBlogs(data.data);
    });
  }, []);
  return (
    <>
      <div
        className="flex-row"
        style={{
          flexWrap: "wrap",
          marginTop: 20,
          display: "flex",
          gap: 16,
        }}
      >
        {!blogs
          ? [1, 2, 3, 4].map((key) => {
              return <CardLoader key={key} />;
            })
          : null}
        {blogs &&
          blogs.map((node) => {
            return (
              <Card
                key={node.blog_id}
                node={node}
                navigate={navigate}
                nodeType="blog"
                nodeIdType="blog_id"
                isMobile={isMobile}
              />
            );
          })}
      </div>
    </>
  );
};

const Books = ({ navigate, isMobile, user_id }) => {
  const [books, setBooks] = useState(null);
  useEffect(() => {
    axiosInstance.get(`/book/get/${user_id}/user_books`).then(({ data }) => {
      setBooks(data.data);
    });
  }, []);

  return (
    <>
      <div
        className="flex-row"
        style={{
          flexWrap: "wrap",
          marginTop: 20,
          display: "flex",
          gap: 16,
        }}
      >
        {!books
          ? [5, 6, 7, 8].map((key) => {
              return <CardLoader key={key} />;
            })
          : null}
        {books &&
          books.map((node) => {
            return (
              <Card
                key={node.book_id}
                node={node}
                navigate={navigate}
                nodeType="book"
                nodeIdType="book_id"
                isMobile={isMobile}
              />
            );
          })}
      </div>
    </>
  );
};

const Card = ({ node, navigate, nodeType, nodeIdType, isMobile }) => {
  const image = JSON.parse(node.images)[0];

  return (
    <div className="card" key={node[nodeIdType]}>
      <div
        className="card-image"
        style={{
          backgroundImage:
            image && image.name
              ? `url("${process.env.REACT_APP_BASE_API_URL}/api/${nodeType}/${node[nodeIdType]}/340/${image.name}")`
              : null,
          overflow: "hidden",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
        onClick={() => {
          navigate(`/view/${nodeType}/${node[nodeIdType]}`, node);
        }}
      />
      <div className="card-body">
        <div
          className="card-title cursor"
          onClick={() => {
            navigate(`/view/${nodeType}/${node[nodeIdType]}`, node);
          }}
        >
          {node.title}
        </div>
        <div
          className="flex-row"
          style={{
            marginTop: 5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            className="avatar"
            style={{
              width: 30,
              height: 30,
              backgroundColor: "#ccc",
              borderRadius: 30,
              marginRight: 10,
            }}
          ></div>
          <div style={{ fontSize: 12 }}>
            <div className="username">Sankar Boro</div>
            <div className="username">{timeAgo(node.created_at)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
