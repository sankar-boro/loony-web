import MarkdownPreview from "@uiw/react-markdown-preview";

import { useState, useEffect, lazy, Suspense } from "react";
import {
  orderBlogNodes,
  deleteBlogNode,
  extractImage,
  updateBlogNode,
  appendBlogNode,
  timeAgo,
} from "loony-utils";
import { RxReader } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import { LuFileWarning } from "react-icons/lu";
import { MdAdd, MdOutlineEdit, MdContentCopy } from "react-icons/md";
import { useParams, Link, useNavigate } from "react-router-dom";

import { axiosInstance } from "loony-query";
import AddNode from "../form/addNode.tsx";
import EditNode from "../form/editNode.tsx";
import ConfirmAction from "../components/ConfirmAction.tsx";
import PageLoadingContainer from "../components/PageLoadingContainer.tsx";
import { getNodes } from "./utils.ts";
import { PageNavigationView } from "./pageNavigation.tsx";
import { AppRouteProps, EditAction, EditState } from "types/index.ts";
import { ApiEvent } from "loony-types";
const MathsMarkdown = lazy(() => import("../components/MathsMarkdown.tsx"));


export default function Edit(props: AppRouteProps) {
  const { isMobile, mobileNavOpen, setMobileNavOpen } = props
  const { blogId } = useParams();
  const blog_id = blogId && parseInt(blogId);

  const [state, setState] = useState<EditState>({
    doc_info: null,
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
    deleteNode: null,
  });
  const [status, setStatus] = useState({
    status: ApiEvent.IDLE,
    error: "",
  });

  useEffect(() => {
    if (blog_id) {
      getNodes(blog_id, setState, setStatus);
    }
  }, [blog_id]);

  if (status.status === ApiEvent.IDLE || status.status === ApiEvent.START)
    return <PageLoadingContainer isMobile={isMobile} />;

  const { childNodes, mainNode, doc_info } = state;

  if (!mainNode) {
    return null
  }

  const image = extractImage(mainNode.images);

  return (
    <div className="book-container">
      <div className="flex-row">
        {isMobile && mobileNavOpen ? (
          <div
            style={{
              width: "100%",
              backgroundColor: "rgb(0,0,0,0.5)",
              zIndex: 10,
              height: "105vh",
            }}
            onClick={() => {
              setMobileNavOpen(false);
            }}
          >
            <div
              style={{
                width: 320,
                backgroundColor: "white",
                maxWidth: "100%",
                height: "100%",
                position: "relative",
                padding: 12,
              }}
            >
              <PageNavigationView
                blog_id={blog_id as number}
                state={state}
                isMobile={isMobile}
              />
            </div>
          </div>
        ) : null}
        {!isMobile ? (
          <div
            style={{
              width: "15%",
              paddingTop: 15,
              borderRight: "1px solid #ebebeb",
            }}
          >
            <PageNavigationView
              blog_id={blog_id as number}
              state={state}
              isMobile={isMobile}
            />
          </div>
        ) : null}
        {state.modal ? (
          <ActivityComponent
            state={state}
            setState={setState}
            blogId={blogId as string}
            isMobile={isMobile}
          />
        ) : (
          <div
            style={{
              width: isMobile ? "90%" : "50%",
              paddingLeft: "5%",
              paddingRight: "5%",
              paddingBottom: "10vh",
              background: "linear-gradient(to right, #ffffff, #F6F8FC)",
              minHeight: "110vh",
            }}
          >
            <div>
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
                  <div className="username">
                    {timeAgo(doc_info.created_at)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                {mainNode.theme === 11 ? (
                  mainNode.body
                ) : mainNode.theme === 24 ? (
                  <MarkdownPreview
                    source={mainNode.body}
                    wrapperElement={{ "data-color-mode": "light" }}
                  />
                ) : mainNode.theme === 41 ? (
                  <Suspense fallback={<div>Loading component...</div>}>
                    <MathsMarkdown source={mainNode.body} />
                  </Suspense>
                ) : null}
              </div>
            </div>
            {/* Main node settings */}
            <div className="flex-row" style={{ marginTop: 24 }}>
              <div
                className="button-none cursor"
                onClick={() => {
                  setState({
                    ...state,
                    addNode: mainNode,
                    modal: "add_node",
                  });
                }}
                style={{ marginRight: 10 }}
              >
                <div className="btn-action">
                  <MdAdd size={16} color="#9c9c9c" />
                </div>
              </div>
              <div
                className="button-none cursor"
                onClick={() => {
                  setState({
                    ...state,
                    editNode: mainNode,
                    pageId: mainNode.uid,
                    modal: "edit_node",
                  });
                }}
                style={{ marginRight: 16 }}
              >
                <div className="btn-action">
                  <MdOutlineEdit size={16} color="#9c9c9c" />
                </div>
              </div>
              <div
                className="button-none cursor"
                onClick={(e) => {
                  navigator.clipboard.writeText(mainNode.body);
                  e.stopPropagation();
                }}
                style={{ marginRight: 16 }}
              >
                <div className="btn-action">
                  <MdContentCopy size={16} color="#9c9c9c" />
                </div>
              </div>
            </div>
            {/* End main node settings */}

            <div
              style={{
                marginTop: 16,
              }}
            >
              {mainNode.identity !== 101 &&
                childNodes.map((node: any, nodeIndex) => {
                  const parseImage = JSON.parse(node.images);
                  const nodeImage =
                    parseImage.length > 0 ? parseImage[0].name : null;
                  return (
                    <div
                      style={{ marginBottom: 50, marginTop: 50 }}
                      key={node.uid}
                    >
                      <div className="section-title">{node.title}</div>
                      {nodeImage ? (
                        <div style={{ width: "100%", borderRadius: 5 }}>
                          <img
                            src={`${process.env.REACT_APP_BASE_API_URL}/api/blog/${blog_id}/720/${nodeImage}`}
                            alt=""
                            width="100%"
                          />
                        </div>
                      ) : null}
                      <div>
                        {node.theme === 11 ? (
                          node.body
                        ) : node.theme === 24 ? (
                          <MarkdownPreview
                            source={node.body}
                            wrapperElement={{ "data-color-mode": "light" }}
                          />
                        ) : node.theme === 41 ? (
                          <Suspense fallback={<div>Loading component...</div>}>
                            <MathsMarkdown source={node.body} />
                          </Suspense>
                        ) : null}
                      </div>

                      {/* Node settings */}
                      <div className="flex-row" style={{ marginTop: 24 }}>
                        <div
                          className="button-none cursor"
                          onClick={() => {
                            setState({
                              ...state,
                              addNode: node,
                              pageId: mainNode.uid,
                              modal: "add_node",
                            });
                          }}
                          style={{ marginRight: 16 }}
                        >
                          <div className="btn-action">
                            <MdAdd size={16} color="#9c9c9c" />
                          </div>
                        </div>
                        <div
                          className="button-none cursor"
                          onClick={() => {
                            setState({
                              ...state,
                              editNode: node,
                              pageId: node.uid,
                              modal: "edit_node",
                            });
                          }}
                          style={{ marginRight: 16 }}
                        >
                          <div className="btn-action">
                            <MdOutlineEdit size={16} color="#9c9c9c" />
                          </div>
                        </div>
                        <div
                          className="delete-button-none cursor"
                          onClick={() => {
                            setState({
                              ...state,
                              activeNode: node,
                              nodeIndex,
                              modal: "delete_node",
                            });
                          }}
                          style={{ marginRight: 16 }}
                        >
                          <div className="btn-action">
                            <AiOutlineDelete size={16} color="#9c9c9c" />
                          </div>
                        </div>
                        <div
                          className="button-none cursor"
                          onClick={(e) => {
                            navigator.clipboard.writeText(node.body);
                            e.stopPropagation();
                          }}
                          style={{ marginRight: 16 }}
                        >
                          <div className="btn-action">
                            <MdContentCopy size={16} color="#9c9c9c" />
                          </div>
                        </div>
                      </div>

                      {/* Node settings end */}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        {!isMobile ? (
          <RightBlogContainer
            blog_id={blog_id as number}
            setState={setState}
            state={state}
          />
        ) : null}
      </div>
    </div>
  );
}

const ActivityComponent = ({ state, setState, blogId, isMobile }: { state: EditState, setState: EditAction, blogId: string, isMobile: boolean }) => {
  const navigate = useNavigate();
  const { activeNode, childNodes, rawNodes, modal, pageId, nodeIndex } = state;
  const deleteNode = () => {
    const delete_node = activeNode;
    if (childNodes) {
      let updateNode: any = null;
      rawNodes.forEach((r) => {
        if (r.parent_id === delete_node.uid) {
          updateNode = r;
        }
      });

      const submitData = {
        pageId,
        identity: delete_node.identity,
        update_parent_id: delete_node.parent_id,
        delete_node_id: delete_node.uid,
        update_node_id: updateNode ? updateNode.uid : null,
      };
      axiosInstance
        .post(`/blog/delete/node`, submitData)
        .then(() => {
          const __rawNodes = deleteBlogNode(rawNodes, submitData, nodeIndex as number);
          const __blogNodes = orderBlogNodes(__rawNodes);
          const __mainNode = __blogNodes && __blogNodes[0];
          const __childNodes = __blogNodes.slice(1);

          setState({
            ...state,
            rawNodes: __rawNodes,
            mainNode: __mainNode,
            pageId: __mainNode.uid,
            childNodes: __childNodes,
            modal: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteBlog = () => {
    axiosInstance
      .post("/blog/delete", { blog_id: parseInt(blogId) })
      .then(() => {
        navigate("/", { replace: true });
      });
  };

  const editFnCallback = (data: any) => {
    const __rawNodes = updateBlogNode(rawNodes, data);
    const __blogNodes = orderBlogNodes(__rawNodes);
    const __mainNode = __blogNodes && __blogNodes[0];
    const __childNodes = __blogNodes.slice(1);

    setState({
      ...state,
      mainNode: __mainNode,
      childNodes: __childNodes,
      blogNodes: __blogNodes,
      rawNodes: __rawNodes,
      modal: "",
    });
  };

  const addNodeCbFn = (data: any) => {
    const __rawNodes = appendBlogNode(rawNodes, activeNode, data);
    const __blogNodes = orderBlogNodes(__rawNodes);
    const __mainNode = __blogNodes && __blogNodes[0];
    const __childNodes = __blogNodes.slice(1);

    setState({
      ...state,
      rawNodes: __rawNodes,
      blogNodes: __blogNodes,
      mainNode: __mainNode,
      childNodes: __childNodes,
      modal: "",
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      modal: "",
      editNode: null,
      addNode: null,
    });
  };

  return (
    <>
      {modal === "add_node" ? (
        <AddNode
          heading="Add Node"
          state={state}
          FnCallback={addNodeCbFn}
          url="/blog/append/node"
          isMobile={isMobile}
          docIdName="blog_id"
          docId={blogId}
          parent_id={activeNode.uid}
          identity={101}
          onCancel={onCancel}
          page_id={pageId as number}
          parent_identity={activeNode.uid}
        />
      ) : null}
      {modal === "delete_node" ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Node?"
          confirmAction={deleteNode}
          title="Delete Node"
          onCancel={onCancel}
        />
      ) : null}

      {modal === "edit_node" ? (
        <EditNode
          heading="Edit Node"
          state={state}
          docIdName="blog_id"
          doc_id={blogId}
          FnCallback={editFnCallback}
          onCancel={onCancel}
          url="/blog/edit/node"
          isMobile={isMobile}
        />
      ) : null}

      {modal === "delete_blog" ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Blog?"
          confirmAction={deleteBlog}
          title="Delete Blog"
          onCancel={onCancel}
        />
      ) : null}
    </>
  );
};

const RightBlogContainer = ({ blog_id, setState, state }: { blog_id: number, setState: EditAction, state: EditState }) => {
  return (
    <div style={{ width: "20%", paddingLeft: 15, paddingTop: 15 }}>
      <ul style={{ paddingLeft: 0, listStyle: "none" }} className="list-item">
        <li>
          <RxReader size={16} color="#2d2d2d" />
          <Link to={`/view/blog/${blog_id}`}>Read Blog</Link>
        </li>
        <li
          onClick={() => {
            setState({
              ...state,
              modal: "delete_blog",
            });
          }}
        >
          <AiOutlineDelete size={16} color="#2d2d2d" />
          <Link to="#">Delete Blog</Link>
        </li>
        <li>
          <LuFileWarning size={16} color="#2d2d2d" />
          <Link to="#">Report</Link>
        </li>
      </ul>
    </div>
  );
};
