import { useState, useEffect, useContext, Suspense } from "react"

import { extractImage, getNav } from "loony-utils"
import { RxReader } from "react-icons/rx"
import { AiOutlineDelete } from "react-icons/ai"
import { useParams, Link, useNavigate } from "react-router-dom"
import { LuFileWarning } from "react-icons/lu"
import EditComponent from "./edit.tsx"
import Nav from "../../nav/book/edit/index.tsx"
import { PageNodeSettings } from "./pageNodeSettings.tsx"
import PageLoadingContainer from "../../components/PageLoadingContainer.tsx"
import AppContext from "../../context/AppContext.tsx"
import BasicMarkdown from "../../components/BasicMarkdown.tsx"
import Modal from "./modal.tsx"

import {
  AppRouteProps,
  DocNode,
  EditBookAction,
  EditBookState,
  PageStatus,
  PageState,
} from "loony-types"
import NodeInfo from "../../components/NodeInfo.tsx"

export default function Edit(props: AppRouteProps) {
  const { isMobile, appContext } = props
  const { base_url } = appContext.env
  const { bookId } = useParams()
  const doc_id = bookId && parseInt(bookId)
  const navigate = useNavigate()
  const { setAppContext } = useContext(AppContext)
  const [status, setStatus] = useState<PageState>({
    status: PageStatus.IDLE,
    error: "",
  })
  const [state, setState] = useState<EditBookState>({
    mainNode: null,
    childNodes: [],
    form: "",
    modal: "",
    parentNode: null,
    topNode: null,
    page_id: null,
    section_id: null,
    groupNodesById: {},
    navNodes: [],
    frontPage: null,
    addNode: null,
    deleteNode: null,
    editNode: null,
    doc_id: doc_id as number,
  })

  useEffect(() => {
    if (doc_id) {
      getNav(doc_id, setState, setStatus)
    }
  }, [doc_id])

  const viewFrontPage = () => {
    setState({
      ...state,
      page_id: state?.frontPage?.uid || null,
      parentNode: state?.frontPage,
      editNode: null,
      addNode: null,
      form: "",
    })
  }

  if (status.status !== PageStatus.VIEW_PAGE)
    return <PageLoadingContainer isMobile={isMobile} />

  const { parentNode, childNodes, mainNode } = state
  if (!parentNode || !mainNode) return null

  return (
    <div className="flex-row full-con">
      <Nav
        doc_id={doc_id as number}
        setState={setState}
        state={state}
        viewFrontPage={viewFrontPage}
        {...props}
      />
      {state.modal && (
        <Modal
          state={state as EditBookState}
          setState={setState as EditBookAction}
          setAppContext={setAppContext}
          doc_id={doc_id as number}
          navigate={navigate}
          isMobile={isMobile}
        />
      )}
      {state.form && (
        <EditComponent
          state={state as EditBookState}
          setState={setState as EditBookAction}
          setAppContext={setAppContext}
          doc_id={doc_id as number}
          navigate={navigate}
          isMobile={isMobile}
        />
      )}
      {!state.form && (
        <div className="con-sm-12 con-xxl-5 mar-hor-1">
          <ParentNode
            parentNode={parentNode}
            doc_id={doc_id as number}
            base_url={base_url}
            setState={setState}
            state={state}
          />

          <div
            style={{
              marginTop: 16,
            }}
          >
            {childNodes.map((subSectionNode) => {
              const subSectionNodeImage = extractImage(subSectionNode.images)

              return (
                <div className="page-section" key={subSectionNode.uid}>
                  <div className="section-title">{subSectionNode.title}</div>
                  {subSectionNodeImage && subSectionNodeImage.name ? (
                    <div style={{ width: "100%", borderRadius: 5 }}>
                      <img
                        src={`${base_url}/api/book/${doc_id}/720/${subSectionNodeImage.name}`}
                        alt=""
                        width="100%"
                      />
                    </div>
                  ) : null}
                  <Suspense fallback={<div>Loading component...</div>}>
                    <BasicMarkdown source={subSectionNode.content} />
                  </Suspense>
                  <PageNodeSettings
                    node={subSectionNode}
                    setState={setState}
                    state={state}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
      {!isMobile ? (
        <RightBookContainer
          doc_id={doc_id as string}
          setState={setState}
          state={state}
        />
      ) : null}
    </div>
  )
}

const ParentNode = ({
  parentNode,
  doc_id,
  base_url,
  setState,
  state,
}: {
  parentNode: DocNode
  doc_id: number
  base_url: string
  setState: EditBookAction
  state: EditBookState
}) => {
  const image = extractImage(parentNode.images)
  return (
    <>
      <div>
        <div className="page-heading">{parentNode.title}</div>
        {image && image.name ? (
          <div style={{ width: "100%", borderRadius: 5 }}>
            <img
              src={`${base_url}/api/book/${doc_id}/720/${image.name}`}
              alt=""
              width="100%"
            />
          </div>
        ) : null}

        {parentNode.identity === 100 ? <NodeInfo node={parentNode} /> : null}
        <div style={{ marginTop: 16 }}>
          <Suspense fallback={<div>Loading component...</div>}>
            <BasicMarkdown source={parentNode.content} />
          </Suspense>
        </div>
      </div>
      <PageNodeSettings node={parentNode} setState={setState} state={state} />
    </>
  )
}

const RightBookContainer = ({
  doc_id,
  setState,
  state,
}: {
  doc_id: string
  setState: EditBookAction
  state: EditBookState
}) => {
  return (
    <div className="doc-settings-container">
      <ul style={{ paddingLeft: 0, listStyle: "none" }} className="list-item">
        <li>
          <RxReader size={16} color="#2d2d2d" />
          <Link to={`/view/book/${doc_id}`}>Read Book</Link>
        </li>
        <li
          onClick={() => {
            setState({
              ...state,
              modal: "delete_book",
            })
          }}
        >
          <AiOutlineDelete size={16} color="#2d2d2d" />
          <Link to="#">Delete Book</Link>
        </li>
        <li>
          <LuFileWarning size={16} color="#2d2d2d" />
          <Link to="#">Report</Link>
        </li>
      </ul>
    </div>
  )
}
