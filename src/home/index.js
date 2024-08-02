import { useEffect, useState } from "react";
import { axiosInstance } from "loony-query";
import { useNavigate } from "react-router-dom";
import CardLoader from "../components/CardLoader";
import { MenuNavContainer } from "../components/Containers";
import { MdHistory } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { IoMdTime } from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";

const Home = ({ isMobile }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container flex-row">
      <div style={{ width: "15%", paddingTop: 10 }}>
        <div style={{ width: "90%", paddingLeft: "5%", paddingRight: "5%" }}>
          <MenuNavContainer>
            <span style={{ marginRight: 10, position: "relative", top: 3 }}>
              <GoHome size={16} color="#2d2d2d" />
            </span>
            <div className="page-nav-title">Home</div>
          </MenuNavContainer>
          <MenuNavContainer>
            <span style={{ marginRight: 10, position: "relative", top: 3 }}>
              <MdHistory size={16} color="#2d2d2d" />
            </span>
            <div className="page-nav-title">History</div>
          </MenuNavContainer>
          <MenuNavContainer>
            <span style={{ marginRight: 10, position: "relative", top: 3 }}>
              <IoMdTime size={16} color="#2d2d2d" />
            </span>
            <div className="page-nav-title">Read Later</div>
          </MenuNavContainer>
          <MenuNavContainer>
            <span style={{ marginRight: 10, position: "relative", top: 3 }}>
              <AiOutlineLike size={16} color="#2d2d2d" />
            </span>
            <div className="page-nav-title">Likes</div>
          </MenuNavContainer>
        </div>
      </div>
      <div style={{ width: "85%" }}>
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
        <div className="card-body" />
      </div>
    </div>
  );
};
export default Home;
