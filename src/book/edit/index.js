import { useState, useEffect, useContext, Suspense, lazy } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

import { orderBookNodes, extractImage } from "loony-utils";
import { RxReader } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import { LuFileWarning } from "react-icons/lu";
import { useParams, Link, useNavigate } from "react-router-dom";

import { axiosInstance } from "loony-query";
import { AuthContext } from "../../context/AuthContext";
import { ModalComponent } from "./modal";
import { PageNavigation } from "./pageNavigation";
import { PageNodeSettings } from "./pageNodeSettings";
import PageLoadingContainer from "../../components/PageLoadingContainer";
const MathsMarkdown = lazy(() => import("../../components/MathsMarkdown"));

export default function Edit() {
  const { bookId } = useParams();
  const book_id = parseInt(bookId);
  const navigate = useNavigate();
  const { setContext } = useContext(AuthContext);
  const [status, setStatus] = useState({
    status: "INIT",
    error: "",
  });
  const [state, setState] = useState({
    modal: "",
    deleteNode: null,
    editNode: null,
    activeNode: null,
    topNode: null,
    page_id: null,
    section_id: null,
    activeSectionsByPageId: [],
    allSectionsByPageId: {},
    activeSubSectionsBySectionId: [],
    allSubSectionsBySectionId: {},
    nodes101: [],
    frontPage: null,
  });

  const { activeNode, nodes101, frontPage, activeSubSectionsBySectionId } =
    state;

  const getChapters = () => {
    axiosInstance.get(`/book/get/nodes?book_id=${book_id}`).then(({ data }) => {
      const bookTree = orderBookNodes(data.data);
      const __frontPage = bookTree && bookTree[0];
      const __nodes101 = bookTree.slice(1);

      setState({
        ...state,
        frontPage: __frontPage,
        activeNode: __frontPage,
        nodes101: __nodes101,
        page_id: __frontPage.uid,
      });
      setStatus({
        ...status,
        status: "",
      });
    });
  };

  useEffect(() => {
    if (book_id) {
      getChapters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book_id]);

  if (status.status === "INIT" || status.status === "FETCHING")
    return <PageLoadingContainer />;

  const image = extractImage(activeNode.images);

  return (
    <div className="book-container">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <PageNavigation
          setState={setState}
          setStatus={setStatus}
          nodes101={nodes101}
          state={state}
          book_id={book_id}
        />

        {/* Page */}
        {state.editNode || state.modal ? (
          <ModalComponent
            state={state}
            setState={setState}
            setContext={setContext}
            book_id={book_id}
            navigate={navigate}
          />
        ) : (
          <>
            <div
              style={{
                width: "50%",
                paddingTop: 15,
                paddingLeft: "5%",
                paddingRight: "5%",
                paddingBottom: 100,
                background: "linear-gradient(to right, #ffffff, #F6F8FC)",
                minHeight: "100vh",
              }}
            >
              <div>
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
              <PageNodeSettings
                node={activeNode}
                setState={setState}
                state={state}
              />

              <div
                style={{
                  marginTop: 16,
                }}
              >
                {activeSubSectionsBySectionId.map((subSectionNode) => {
                  const subSectionNodeImage = extractImage(
                    subSectionNode.images
                  );

                  return (
                    <div className="page-section" key={subSectionNode.uid}>
                      <div className="section-title">
                        {subSectionNode.title}
                      </div>
                      {subSectionNodeImage && subSectionNodeImage.name ? (
                        <div style={{ width: "100%", borderRadius: 5 }}>
                          <img
                            src={`${process.env.REACT_APP_BASE_API_URL}/api/book/${book_id}/720/${subSectionNodeImage.name}`}
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
                      <PageNodeSettings
                        node={subSectionNode}
                        setState={setState}
                        state={state}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <RightBookContainer
              book_id={book_id}
              setState={setState}
              state={state}
            />
          </>
        )}
      </div>
    </div>
  );
}

const RightBookContainer = ({ book_id, setState, state }) => {
  return (
    <div style={{ width: "18%", paddingLeft: 15, paddingTop: 15 }}>
      <ul style={{ paddingLeft: 0, listStyle: "none" }} className="list-item">
        <li style={{ display: "flex", alignItems: "center" }}>
          <RxReader size={16} color="#2d2d2d" />
          <Link to={`/view/book/${book_id}`} style={{ marginLeft: 5 }}>
            Read Book
          </Link>
        </li>
        <li
          onClick={() => {
            setState({
              ...state,
              modal: "delete_book",
            });
          }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <AiOutlineDelete size={16} color="#2d2d2d" />
          <span style={{ marginLeft: 5 }}>Delete Book</span>
        </li>
        <li style={{ display: "flex", alignItems: "center" }}>
          <LuFileWarning size={16} color="#2d2d2d" />
          <span style={{ marginLeft: 5 }}>Report</span>
        </li>
      </ul>
    </div>
  );
};
