import { useState, useEffect } from "react";
import LeftNavbar from "../common/HomeLeftNavbar.tsx";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { axiosInstance } from "loony-api";
import { User, AppRouteProps, DocNode } from "loony-types";
import { EmptyBlog, EmptyBook } from "../components/EmptyCard.tsx";
import NodeInfo from "../components/NodeInfo.tsx";

const Profile = (props: AppRouteProps) => {
  const { isMobile, authContext, appContext } = props;
  const { base_url } = appContext.env;
  const { user } = authContext;
  const navigate = useNavigate();

  const { fname, lname, uid } = user as User;

  return (
    <div className="book-container flex-row">
      {!isMobile ? <LeftNavbar /> : null}
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
          <Blogs
            user_id={uid}
            navigate={navigate}
            isMobile={isMobile}
            base_url={base_url}
          />
          <Books
            user_id={uid}
            navigate={navigate}
            isMobile={isMobile}
            base_url={base_url}
          />
        </div>
      </div>
    </div>
  );
};

const Blogs = ({
  navigate,
  isMobile,
  user_id,
  base_url,
}: {
  navigate: NavigateFunction;
  isMobile: boolean;
  user_id: number;
  base_url: string;
}) => {
  const [blogs, setBlogs] = useState<DocNode[] | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/blog/get/${user_id}/user_blogs`)
      .then(({ data }) => {
        setBlogs(data);
      })
      .catch((err) => {
        console.log(err);
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
        {!blogs ? <EmptyBlog navigate={navigate} /> : null}
        {blogs &&
          blogs.map((node) => {
            return (
              <Card
                key={node.uid}
                node={node}
                navigate={navigate}
                nodeType="blog"
                nodeIdType="uid"
                isMobile={isMobile}
                base_url={base_url}
              />
            );
          })}
      </div>
    </>
  );
};

const Books = ({
  navigate,
  isMobile,
  user_id,
  base_url,
}: {
  navigate: NavigateFunction;
  isMobile: boolean;
  user_id: number;
  base_url: string;
}) => {
  const [books, setBooks] = useState<DocNode[] | null>(null);
  useEffect(() => {
    axiosInstance
      .get(`/book/get/${user_id}/user_books`)
      .then(({ data }) => {
        setBooks(data);
      })
      .catch((err) => {
        console.log(err);
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
        {!books ? <EmptyBook navigate={navigate} /> : null}
        {books &&
          books.map((node: DocNode) => {
            return (
              <Card
                key={node.uid}
                node={node}
                navigate={navigate}
                nodeType="book"
                nodeIdType="uid"
                isMobile={isMobile}
                base_url={base_url}
              />
            );
          })}
      </div>
    </>
  );
};

const Card = ({
  node,
  navigate,
  nodeType,
  nodeIdType,
  base_url,
}: {
  navigate: NavigateFunction;
  isMobile: boolean;
  nodeIdType: string;
  nodeType: string;
  node: DocNode;
  base_url: string;
}) => {
  const image = JSON.parse(node.images)[0];

  return (
    <div className="card" key={node[nodeIdType]}>
      <div
        className="card-image"
        style={{
          backgroundImage:
            image && image.name
              ? `url("${base_url}/api/${nodeType}/${node[nodeIdType]}/340/${image.name}")`
              : undefined,
          overflow: "hidden",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
        onClick={() => {
          navigate(`/view/${nodeType}/${node[nodeIdType]}`);
        }}
      />
      <div className="card-body">
        <div
          className="card-title cursor"
          onClick={() => {
            navigate(`/view/${nodeType}/${node[nodeIdType]}`);
          }}
        >
          {node.title}
        </div>
        <NodeInfo node={node} />
      </div>
    </div>
  );
};

export default Profile;
