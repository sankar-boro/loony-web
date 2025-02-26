/* eslint-disable @typescript-eslint/no-unused-vars */
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Suspense, useCallback } from "react";
import {
  extractImage,
  updateBlogNode,
  appendBlogNode,
  orderBlogChildNodes,
} from "loony-utils";
import { RxReader } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import { LuFileWarning } from "react-icons/lu";
import { MdAdd, MdOutlineEdit, MdContentCopy } from "react-icons/md";
import { Link } from "react-router-dom";
import AddNode from "../../form/addNode.tsx";
import EditNodeForm from "../../form/editNode.tsx";
import { Chapters } from "../common/BlogPageNavigation.tsx";
import {
  AppendNodeResponse,
  AppRouteProps,
  EditBlogState,
  EditBlogAction,
} from "loony-types";
import { DocNode } from "loony-types";
import NodeInfo from "../../components/NodeInfo.tsx";
import Modal from "./modal.tsx";

export default function RenderComponent({
  props,
  state,
  blog_id,
  setState,
}: {
  props: AppRouteProps;
  state: EditBlogState;
  blog_id: number;
  setState: React.Dispatch<React.SetStateAction<EditBlogState>>;
}) {
  const base_url = props.appContext.env.base_url;
  const { isMobile, mobileNavOpen, setMobileNavOpen } = props;
  const { mainNode, childNodes } = state;

  if (!mainNode || !mainNode) return null;

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
              <Chapters state={state} />
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
            <Chapters state={state} />
          </div>
        ) : null}
        {state.modal && (
          <Modal
            state={state}
            setState={setState}
            blog_id={blog_id as number}
          />
        )}
        {state.form && (
          <ActivityComponent
            state={state}
            setState={setState}
            blog_id={blog_id as number}
            isMobile={isMobile}
          />
        )}
        {!state.form && (
          <div
            style={{
              width: isMobile ? "90%" : "50%",
              paddingLeft: "5%",
              paddingRight: "5%",
              paddingBottom: "10vh",
              minHeight: "110vh",
            }}
          >
            <div>
              <div className="page-heading">{mainNode.title}</div>
              {image && image.name ? (
                <div style={{ width: "100%", borderRadius: 5 }}>
                  <img
                    src={`${base_url}/api/blog/${blog_id}/720/${image.name}`}
                    alt=""
                    width="100%"
                  />
                </div>
              ) : null}

              <NodeInfo node={mainNode} />

              <div style={{ marginTop: 16 }}>
                {/* {mainNode.theme === 11 ? (
                  mainNode.content
                ) : mainNode.theme === 24 ? (
                  <MarkdownPreview
                    source={mainNode.content}
                    wrapperElement={{ 'data-color-mode': 'light' }}
                  />
                ) : mainNode.theme === 41 ? (
                  <Suspense fallback={<div>Loading component...</div>}>
                    <MathsMarkdown source={mainNode.content} />
                  </Suspense>
                ) : null} */}
                <Suspense fallback={<div>Loading component...</div>}>
                  <MarkdownPreview
                    source={mainNode.content}
                    wrapperElement={{ "data-color-mode": "light" }}
                  />
                </Suspense>
              </div>
            </div>
            {/* Main node settings */}
            <div className="flex-row" style={{ marginTop: 24 }}>
              <div
                className="button-none cursor"
                onClick={() => {
                  setState({
                    ...state,
                    // status: DocStatus.CreateNode,
                    addNode: mainNode,
                    form: "add_node",
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
                    // status: DocStatus.DeleteNode,
                    editNode: mainNode,
                    form: "edit_node",
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
                  navigator.clipboard.writeText(mainNode.content);
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
                childNodes.map((node, nodeIndex) => {
                  const parseImage = JSON.parse(node.images as string);
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
                            src={`${base_url}/api/blog/${blog_id}/720/${nodeImage}`}
                            alt=""
                            width="100%"
                          />
                        </div>
                      ) : null}
                      <div>
                        {/* {node.theme === 11 ? (
                          node.content
                        ) : node.theme === 24 ? (
                          <MarkdownPreview
                            source={node.content}
                            wrapperElement={{ 'data-color-mode': 'light' }}
                          />
                        ) : node.theme === 41 ? (
                          <Suspense fallback={<div>Loading component...</div>}>
                            <MathsMarkdown source={node.content} />
                          </Suspense>
                        ) : null} */}
                        <Suspense fallback={<div>Loading component...</div>}>
                          <MarkdownPreview
                            source={node.content}
                            wrapperElement={{ "data-color-mode": "light" }}
                          />
                        </Suspense>
                      </div>

                      {/* Node settings */}
                      <div className="flex-row" style={{ marginTop: 24 }}>
                        <div
                          className="button-none cursor"
                          onClick={() => {
                            setState({
                              ...state,
                              addNode: node,
                              form: "add_node",
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
                              form: "edit_node",
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
                              deleteNode: node,
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
                            navigator.clipboard.writeText(node.content);
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

const ActivityComponent = ({
  state,
  setState,
  blog_id,
  isMobile,
}: {
  state: EditBlogState;
  setState: EditBlogAction;
  blog_id: number;
  isMobile: boolean;
}) => {
  const { childNodes, form, mainNode, addNode } = state;

  const editFnCallback = useCallback(
    (data: DocNode) => {
      const nodesAfterUpdate = updateBlogNode(childNodes, data);
      const orderChildNodes = orderBlogChildNodes(nodesAfterUpdate, mainNode);
      const newChildNodes =
        orderChildNodes.length >= 2 ? orderChildNodes.slice(1) : [];

      setState({
        ...state,
        childNodes: newChildNodes,
        form: "",
      });
    },
    [setState, childNodes, mainNode, state]
  );

  const addNodeCbFn = (data: AppendNodeResponse) => {
    if (!addNode) return;
    const nodesAfterAdd = appendBlogNode(childNodes, addNode, data, mainNode);
    const newChildNodes = orderBlogChildNodes(nodesAfterAdd, mainNode);

    setState({
      ...state,
      addNode: null,
      childNodes: newChildNodes,
      form: "",
    });
  };

  const onCancel = useCallback(() => {
    setState({
      ...state,
      form: "",
      editNode: null,
      addNode: null,
    });
  }, [setState, state]);

  if (!mainNode) return null;

  return (
    <>
      {form === "add_node" && state.addNode ? (
        <AddNode
          heading="Add Node"
          FnCallback={addNodeCbFn}
          url="/blog/append/node"
          isMobile={isMobile}
          docIdName="blog_id"
          doc_id={blog_id}
          parent_id={state.addNode.uid}
          identity={101}
          onCancel={onCancel}
          page_id={mainNode.uid as number}
          parent_identity={state.addNode.uid}
        />
      ) : null}

      {form === "edit_node" && state.editNode ? (
        <EditNodeForm
          heading="Edit Node"
          state={state}
          docIdName="blog_id"
          doc_id={blog_id}
          FnCallback={editFnCallback}
          onCancel={onCancel}
          url="/blog/edit"
          isMobile={isMobile}
        />
      ) : null}
    </>
  );
};

const RightBlogContainer = ({
  blog_id,
  setState,
  state,
}: {
  blog_id: number;
  setState: EditBlogAction;
  state: EditBlogState;
}) => {
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
