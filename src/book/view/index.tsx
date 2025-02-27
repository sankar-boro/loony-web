import { useState, useEffect } from "react"
import { LuFileWarning } from "react-icons/lu"
import { FiEdit2 } from "react-icons/fi"
import { extractImage, getNav } from "loony-utils"

import { useParams, Link } from "react-router-dom"
import PageLoadingContainer from "../../components/PageLoadingContainer.tsx"
import {
  AppRouteProps,
  DocNode,
  ReadBookState,
  PageStatus,
  AuthContextProps,
  AuthStatus,
} from "loony-types"
import BasicMarkdown from "../../components/BasicMarkdown.tsx"
import NodeInfo from "../../components/NodeInfo.tsx"
import Nav from "../../nav/book/view/index.tsx"

const View = (props: AppRouteProps) => {
  const { isMobile, appContext, authContext } = props
  const isDesktop = !isMobile
  const { base_url } = appContext.env
  const { bookId } = useParams()
  const doc_id = bookId && parseInt(bookId)
  const [pageStatus, setStatus] = useState({
    status: PageStatus.IDLE,
    error: "",
  })

  const [state, setState] = useState<ReadBookState>({
    mainNode: null,
    parentNode: null,
    page_id: null,
    section_id: null,
    groupNodesById: {},
    navNodes: [],
    childNodes: [],
    frontPage: null,
  })

  useEffect(() => {
    if (doc_id) {
      getNav(doc_id, setState, setStatus)
    }
  }, [doc_id])

  const viewFrontPage = () => {
    setState({
      ...state,
      page_id: state.frontPage?.uid || null,
      parentNode: frontPage,
      childNodes: [],
    })
  }

  const { parentNode, navNodes, frontPage, childNodes, mainNode } = state

  if (pageStatus.status !== PageStatus.VIEW_PAGE)
    return <PageLoadingContainer isMobile={isMobile} />

  if (!parentNode || !mainNode || !frontPage) return null

  return (
    <div className="flex-row full-con">
      <Nav
        doc_id={doc_id as number}
        setState={setState}
        state={state}
        viewFrontPage={viewFrontPage}
        navNodes={navNodes}
        {...props}
      />
      <div className="con-sm-12 con-xxl-5 mar-hor-1">
        <ParentNode
          parentNode={parentNode}
          doc_id={doc_id as number}
          base_url={base_url}
        />
        {childNodes.map((subSectionNode) => {
          const nodeImage = extractImage(subSectionNode.images)
          return (
            <div className="page-section" key={subSectionNode.uid}>
              <div className="section-title">{subSectionNode.title}</div>
              {nodeImage && nodeImage.name ? (
                <div style={{ width: "100%", borderRadius: 5 }}>
                  <img
                    src={`${base_url}/api/book/${doc_id}/720/${nodeImage.name}`}
                    alt=""
                    width="100%"
                  />
                </div>
              ) : null}
              <BasicMarkdown source={subSectionNode.content} />
            </div>
          )
        })}
        <div style={{ height: 50 }} />
      </div>

      {/*
       * @Page End
       */}
      {isDesktop ? (
        <RightBookContainer
          doc_id={doc_id as number}
          authContext={authContext}
        />
      ) : null}
    </div>
  )
}

const ParentNode = ({
  parentNode,
  doc_id,
  base_url,
}: {
  parentNode: DocNode
  doc_id: number
  base_url: string
}) => {
  const image = extractImage(parentNode.images)
  return (
    <div
      style={{
        marginBottom: 24,
      }}
    >
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
        <BasicMarkdown source={parentNode.content} />
      </div>
    </div>
  )
}

const RightBookContainer = ({
  doc_id,
  authContext,
}: {
  doc_id: number
  authContext: AuthContextProps
}) => {
  const isAuth = authContext.status === AuthStatus.AUTHORIZED
  return (
    <div className="doc-settings-container">
      <ul className="list-item" style={{ paddingLeft: 0, listStyle: "none" }}>
        {isAuth && (
          <li>
            <FiEdit2 color="#2d2d2d" size={16} />
            <Link to={`/edit/book/${doc_id}`}>Edit this page</Link>
          </li>
        )}
        <li>
          <LuFileWarning color="#2d2d2d" size={16} />
          <Link to="#">Report</Link>
        </li>
      </ul>
    </div>
  )
}

export default View
