import { useEffect, useState } from "react";
import { axiosInstance } from "loony-query";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "loony-utils";

import CardLoader from "../components/CardLoader";
import Navbar from "./Navbar";

const Home = ({ isMobile }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container flex-row">
      {!isMobile ? <Navbar /> : null}
      <div
        style={{
          width: isMobile ? "100%" : "70%",
          paddingRight: isMobile ? "0%" : "5%",
          paddingLeft: isMobile ? "0%" : "5%",
        }}
      >
        <Blogs navigate={navigate} isMobile={isMobile} />
        <Books navigate={navigate} isMobile={isMobile} />
      </div>
    </div>
  );
};

const Blogs = ({ navigate, isMobile }) => {
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    axiosInstance.get("/blog/get/all").then(({ data }) => {
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

const Books = ({ navigate, isMobile }) => {
  const [books, setBooks] = useState(null);
  useEffect(() => {
    axiosInstance.get("/book/get/all").then(({ data }) => {
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
export default Home;
