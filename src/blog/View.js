import { useState, useEffect } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Link, useParams } from "react-router-dom";
import { extractImage } from "loony-utils";
import { LuFileWarning } from "react-icons/lu";
import { LuFileEdit } from "react-icons/lu";
import PageLoadingContainer from "../components/PageLoadingContainer";
import { getNodes } from "./utils";

const View = ({ isMobile }) => {
  const { blogId } = useParams();
  const blog_id = parseInt(blogId);

  const [state, setState] = useState({
    pageId: null,
    mainNode: null,
    activeNode: null,
    addNode: null,
    editNode: null,
    nodeIndex: null,
    rawNodes: [],
    blogNodes: [],
    modal: "",
    childNodes: [],
  });
  const [status, setStatus] = useState({
    status: "INIT",
    error: "",
  });

  useEffect(() => {
    if (blog_id) {
      getNodes(blog_id, setState, setStatus);
    }
  }, [blog_id]);

  if (status.status === "INIT" || status.status === "FETCHING")
    return <PageLoadingContainer />;

  const { blogNodes, childNodes, mainNode } = state;
  const image = extractImage(mainNode.images);

  return (
    <div className="book-container">
      <div style={{ display: "flex", flexDirection: "row" }}>
        {!isMobile ? (
          <div
            style={{
              width: "20%",
              paddingTop: 15,
              borderRight: "1px solid #ebebeb",
            }}
          >
            {(blogNodes && blogNodes).map((blog_node) => {
              return (
                <div className="chapter-nav-con" key={blog_node.uid}>
                  <div className="chapter-nav">{blog_node.title}</div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div
          style={{
            width: isMobile ? "100%" : "50%",
            paddingTop: 15,
            paddingLeft: "5%",
            paddingRight: "5%",
            background: "linear-gradient(to right, #ffffff, #F6F8FC)",
            marginBottom: 24,
            minHeight: "110vh",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div className="page-heading">{mainNode.title}</div>
            {image && image.name ? (
              <div style={{ width: "100%", borderRadius: 5 }}>
                <img
                  src={`${process.env.REACT_APP_BASE_API_URL}/api/blog/${blog_id}/720/${image.name}`}
                  alt=""
                  width="100%"
                />
              </div>
            ) : null}
            <MarkdownPreview
              source={mainNode.body}
              wrapperElement={{ "data-color-mode": "light" }}
            />
          </div>
          {childNodes.map((blog_node) => {
            const parseImage = JSON.parse(blog_node.images);
            const nodeImage = parseImage.length > 0 ? parseImage[0].name : null;
            return (
              <div className="page-section" key={blog_node.uid}>
                <div className="section-title">{blog_node.title}</div>
                {nodeImage ? (
                  <div style={{ width: "100%", borderRadius: 5 }}>
                    <img
                      src={`${process.env.REACT_APP_BASE_API_URL}/api/blog/${blog_id}/720/${nodeImage}`}
                      alt=""
                      width="100%"
                    />
                  </div>
                ) : null}
                <MarkdownPreview
                  source={blog_node.body}
                  wrapperElement={{ "data-color-mode": "light" }}
                />
              </div>
            );
          })}
          <div style={{ height: 50 }} />
        </div>
        {!isMobile ? (
          <div style={{ width: "20%", paddingLeft: 15, paddingTop: 15 }}>
            <ul
              style={{ paddingLeft: 0, listStyle: "none" }}
              className="list-item"
            >
              <li>
                <LuFileEdit color="#2d2d2d" size={16} />

                <Link to={`/edit/blog/${blog_id}`} style={{ marginLeft: 5 }}>
                  Edit this page
                </Link>
              </li>
              <li>
                <LuFileWarning color="#2d2d2d" size={16} /> Report
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default View;
