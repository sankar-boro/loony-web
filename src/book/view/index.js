import { useState, useEffect, Suspense, lazy } from "react";
import { LuFileEdit } from "react-icons/lu";
import { LuFileWarning } from "react-icons/lu";
import { extractImage } from "loony-utils";
import MarkdownPreview from "@uiw/react-markdown-preview";

import { useParams, Link } from "react-router-dom";
import { getChapters } from "./utils";
import { PageNavigation } from "./pageNavigation";
import PageLoadingContainer from "../../components/PageLoadingContainer";
const MathsMarkdown = lazy(() => import("../../components/MathsMarkdown"));

const View = ({ mobileNavOpen, setMobileNavOpen, isMobile }) => {
  const { bookId } = useParams();
  const book_id = parseInt(bookId);
  const [status, setStatus] = useState({
    status: "INIT",
    error: "",
  });

  const [state, setState] = useState({
    activeNode: null,
    page_id: null,
    section_id: null,
    activeSectionsByPageId: [],
    allSectionsByPageId: {},
    activeSubSectionsBySectionId: [],
    allSubSectionsBySectionId: {},
    nodes101: [],
    frontPage: null,
  });
  const { activeNode, nodes101, activeSubSectionsBySectionId } = state;

  useEffect(() => {
    if (book_id) {
      getChapters(book_id, setState, setStatus);
    }
  }, [book_id]);

  if (status.status === "INIT" || status.status === "FETCHING")
    return <PageLoadingContainer />;

  const image = extractImage(activeNode.images);

  return (
    <div className="book-container">
      <div style={{ display: "flex", flexDirection: "row" }}>
        {/*
         * @ Left Navigation
         */}
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
              <PageNavigation
                setState={setState}
                setStatus={setStatus}
                nodes101={nodes101}
                state={state}
                book_id={book_id}
              />
            </div>
            <EditContainerMobile node={activeNode} book_id={book_id} />
          </div>
        ) : (
          <div
            style={{
              width: "20%",
              paddingTop: 15,
              borderRight: "1px solid #ebebeb",
            }}
          >
            <PageNavigation
              setState={setState}
              setStatus={setStatus}
              nodes101={nodes101}
              state={state}
              book_id={book_id}
            />
          </div>
        )}
        {/*
         * @ Left Navigation End
         */}

        {/*
         * @Page
         */}
        <div
          style={{
            width: isMobile ? "90%" : "60%",
            paddingTop: 15,
            paddingLeft: "5%",
            paddingRight: "5%",
            background: "linear-gradient(to right, #ffffff, #F6F8FC)",
            minHeight: "100vh",
          }}
        >
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <div className="page-heading">{activeNode.title}</div>
            {image && image.name ? (
              <div style={{ width: "100%", borderRadius: 5 }}>
                <img
                  src={`${process.env.REACT_APP_BASE_API_URL}/api/book/${book_id}/720/${image.name}`}
                  alt=""
                  width="100%"
                />
              </div>
            ) : null}
            {activeNode.theme === 11 ? (
              activeNode.body
            ) : activeNode.theme === 24 ? (
              <MarkdownPreview
                source={activeNode.body}
                wrapperElement={{ "data-color-mode": "light" }}
              />
            ) : activeNode.theme === 41 ? (
              <Suspense fallback={<div>Loading component...</div>}>
                <MathsMarkdown source={activeNode.body} />
              </Suspense>
            ) : null}
          </div>
          {activeSubSectionsBySectionId.map((subSectionNode) => {
            const nodeImage = extractImage(subSectionNode.images);
            return (
              <div className="page-section" key={subSectionNode.uid}>
                <div className="section-title">{subSectionNode.title}</div>
                {nodeImage && nodeImage.name ? (
                  <div style={{ width: "100%", borderRadius: 5 }}>
                    <img
                      src={`${process.env.REACT_APP_BASE_API_URL}/api/book/${book_id}/720/${nodeImage.name}`}
                      alt=""
                      width="100%"
                    />
                  </div>
                ) : null}
                {subSectionNode.theme === 11 ? (
                  subSectionNode.body
                ) : subSectionNode.theme === 24 ? (
                  <MarkdownPreview
                    source={subSectionNode.body}
                    wrapperElement={{ "data-color-mode": "light" }}
                  />
                ) : subSectionNode.theme === 41 ? (
                  <Suspense fallback={<div>Loading component...</div>}>
                    <MathsMarkdown source={subSectionNode.body} />
                  </Suspense>
                ) : null}
              </div>
            );
          })}
          <div style={{ height: 50 }} />
        </div>
        {/*
         * @Page End
         */}
        {!isMobile ? (
          <RightBookContainer node={activeNode} book_id={book_id} />
        ) : null}
      </div>
    </div>
  );
};

const RightBookContainer = ({ node, book_id }) => {
  return (
    <div style={{ width: "20%", paddingLeft: 15, paddingTop: 15 }}>
      <ul className="list-item" style={{ paddingLeft: 0, listStyle: "none" }}>
        <li style={{ display: "flex", alignItems: "center" }}>
          <LuFileEdit color="#2d2d2d" size={16} />
          <Link to={`/edit/book/${book_id}`} style={{ marginLeft: 5 }}>
            Edit this page
          </Link>
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <LuFileWarning color="#2d2d2d" size={16} />
          <span style={{ marginLeft: 5 }}>Report</span>
        </li>
      </ul>
      <div style={{ borderTop: "1px solid #ccc", marginTop: 5, paddingTop: 5 }}>
        <ul style={{ paddingLeft: 0, listStyle: "none" }}>
          <li>{node.title}</li>
        </ul>
      </div>
    </div>
  );
};

const EditContainerMobile = ({ node, book_id }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        paddingLeft: 15,
        paddingTop: 15,
      }}
    >
      <ul className="list-item" style={{ paddingLeft: 0, listStyle: "none" }}>
        <li style={{ display: "flex", alignItems: "center" }}>
          <LuFileEdit color="#2d2d2d" size={16} />
          <Link to={`/edit/book/${book_id}`} style={{ marginLeft: 5 }}>
            Edit this page
          </Link>
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <LuFileWarning color="#2d2d2d" size={16} />
          <span style={{ marginLeft: 5 }}>Report</span>
        </li>
      </ul>
    </div>
  );
};

export default View;
