import { useState, useEffect, Suspense, lazy } from "react";
import { LuFileWarning, LuFileEdit } from "react-icons/lu";
import { extractImage } from "loony-utils";
import MarkdownPreview from "@uiw/react-markdown-preview";

import { useParams, Link } from "react-router-dom";
import { getChapters } from "./utils";
import { timeAgo } from "loony-utils";
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
    book_info: null,
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

  useEffect(() => {
    if (book_id) {
      getChapters(book_id, setState, setStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book_id]);

  if (status.status === "INIT" || status.status === "FETCHING")
    return <PageLoadingContainer isMobile={isMobile} />;

  const { activeNode, nodes101, activeSubSectionsBySectionId, book_info } =
    state;
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
            <PageNavigation
              setState={setState}
              setStatus={setStatus}
              nodes101={nodes101}
              state={state}
              book_id={book_id}
            />
          </div>
        ) : null}
        {/*
         * @ Left Navigation End
         */}

        {/*
         * @Page
         */}
        <div
          style={{
            width: isMobile ? "90%" : "50%",
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

            {activeNode.identity === 100 ? (
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
                    {timeAgo(book_info.created_at)}
                  </div>
                </div>
              </div>
            ) : null}

            <div style={{ marginTop: 16 }}>
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
        <li>
          <LuFileEdit color="#2d2d2d" size={16} />
          <Link to={`/edit/book/${book_id}`}>Edit this page</Link>
        </li>
        <li>
          <LuFileWarning color="#2d2d2d" size={16} />
          <Link to="#">Report</Link>
        </li>
      </ul>
    </div>
  );
};

export default View;
