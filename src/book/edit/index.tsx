import { useState, useEffect, useContext, Suspense } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'

import { extractImage, timeAgo } from 'loony-utils'
import { RxReader } from 'react-icons/rx'
import { AiOutlineDelete } from 'react-icons/ai'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { LuFileWarning } from 'react-icons/lu'

import { getChapters } from 'loony-utils'
import EditComponent from './edit.tsx'
import { PageNavigation } from '../common/editPageNavigation.tsx'
import { PageNodeSettings } from './pageNodeSettings.tsx'
import PageLoadingContainer from '../../components/PageLoadingContainer.tsx'
import AppContext from '../../context/AppContext.tsx'
import {
  PageStatusDispatchAction,
  AppRouteProps,
  BooleanDispatchAction,
  DocNode,
  EditBookAction,
  EditBookState,
  PageStatus,
  Status,
  VoidReturnFunction,
} from 'loony-types'

export default function Edit({
  mobileNavOpen,
  setMobileNavOpen,
  isMobile,
  appContext,
}: AppRouteProps) {
  const { base_url } = appContext.env
  const { bookId } = useParams()
  const book_id = bookId && parseInt(bookId)
  const navigate = useNavigate()
  const { setAppContext } = useContext(AppContext)
  const [status, setStatus] = useState<PageStatus>({
    status: Status.IDLE,
    error: '',
  })
  const [state, setState] = useState<EditBookState>({
    mainNode: null,
    childNodes: [],
    modal: '',
    parentNode: null,
    topNode: null,
    page_id: null,
    section_id: null,
    activeSectionsByPageId: [],
    allSectionsByPageId: {},
    activeSubSectionsBySectionId: [],
    allSubSectionsBySectionId: {},
    nodes101: [],
    frontPage: null,
    addNode: null,
    deleteNode: null,
    editNode: null,
    doc_id: book_id as number,
  })

  useEffect(() => {
    if (book_id) {
      getChapters(book_id, setState, setStatus)
    }
  }, [book_id])

  const viewFrontPage = () => {
    setState({
      ...state,
      page_id: state?.frontPage?.uid || null,
      parentNode: state?.frontPage,
      editNode: null,
      addNode: null,
      modal: '',
    })
  }

  if (status.status === Status.IDLE || status.status === Status.FETCHING)
    return <PageLoadingContainer isMobile={isMobile} />

  const { parentNode, activeSubSectionsBySectionId, mainNode } = state

  if (!parentNode || !mainNode) return null

  return (
    <div className="book-container">
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {isMobile && mobileNavOpen ? (
          <MobileNav
            state={state}
            setState={setState}
            book_id={book_id as number}
            isMobile={isMobile}
            setMobileNavOpen={setMobileNavOpen}
            setStatus={setStatus}
            viewFrontPage={viewFrontPage}
          />
        ) : null}
        {!isMobile ? (
          <div
            style={{
              width: '15%',
              paddingTop: 15,
              borderRight: '1px solid #ebebeb',
            }}
          >
            <PageNavigation
              setState={setState}
              setStatus={setStatus}
              state={state}
              book_id={book_id as number}
              isMobile={isMobile}
              viewFrontPage={viewFrontPage}
            />
          </div>
        ) : null}

        {/* Page */}
        {state.modal ? (
          <EditComponent
            state={state as EditBookState}
            setState={setState as EditBookAction}
            setAppContext={setAppContext}
            doc_id={book_id as number}
            navigate={navigate}
            isMobile={isMobile}
          />
        ) : (
          <>
            <div
              style={{
                width: isMobile ? '90%' : '50%',
                paddingTop: 15,
                paddingLeft: '5%',
                paddingRight: '5%',
                paddingBottom: 100,
                background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
                minHeight: '100vh',
              }}
            >
              <ParentNode
                parentNode={parentNode}
                book_id={book_id as number}
                base_url={base_url}
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
                  )

                  return (
                    <div className="page-section" key={subSectionNode.uid}>
                      <div className="section-title">
                        {subSectionNode.title}
                      </div>
                      {subSectionNodeImage && subSectionNodeImage.name ? (
                        <div style={{ width: '100%', borderRadius: 5 }}>
                          <img
                            src={`${base_url}/api/book/${book_id}/720/${subSectionNodeImage.name}`}
                            alt=""
                            width="100%"
                          />
                        </div>
                      ) : null}
                      <Suspense fallback={<div>Loading component...</div>}>
                        <MarkdownPreview source={parentNode.content} />
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

            {!isMobile ? (
              <RightBookContainer
                book_id={book_id as string}
                setState={setState}
                state={state}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

const MobileNav = ({
  state,
  setState,
  book_id,
  isMobile,
  setMobileNavOpen,
  setStatus,
  viewFrontPage,
}: {
  state: EditBookState
  setState: EditBookAction
  book_id: number
  isMobile: boolean
  setMobileNavOpen: BooleanDispatchAction
  setStatus: PageStatusDispatchAction
  viewFrontPage: VoidReturnFunction
}) => {
  return (
    <>
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgb(0,0,0,0.5)',
          zIndex: 10,
          height: '105vh',
        }}
        onClick={() => {
          setMobileNavOpen(false)
        }}
      >
        <div
          style={{
            width: 320,
            backgroundColor: 'white',
            maxWidth: '100%',
            height: '100%',
            position: 'relative',
            padding: 12,
          }}
        >
          <PageNavigation
            setState={setState}
            setStatus={setStatus}
            state={state}
            book_id={book_id as number}
            isMobile={isMobile}
            viewFrontPage={viewFrontPage}
          />
        </div>
      </div>
    </>
  )
}

const ParentNode = ({
  parentNode,
  book_id,
  base_url,
  setState,
  state,
}: {
  parentNode: DocNode
  book_id: number
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
          <div style={{ width: '100%', borderRadius: 5 }}>
            <img
              src={`${base_url}/api/book/${book_id}/720/${image.name}`}
              alt=""
              width="100%"
            />
          </div>
        ) : null}

        {parentNode.identity === 100 ? (
          <div
            className="flex-row"
            style={{
              marginTop: 5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              className="avatar"
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#ccc',
                borderRadius: 30,
                marginRight: 10,
              }}
            ></div>
            <div style={{ fontSize: 12 }}>
              <div className="username">Sankar Boro</div>
              <div className="username">{timeAgo(parentNode.created_at)}</div>
            </div>
          </div>
        ) : null}
        <div style={{ marginTop: 16 }}>
          <Suspense fallback={<div>Loading component...</div>}>
            <MarkdownPreview source={parentNode.content} />
          </Suspense>
        </div>
      </div>
      <PageNodeSettings node={parentNode} setState={setState} state={state} />
    </>
  )
}

const RightBookContainer = ({
  book_id,
  setState,
  state,
}: {
  book_id: string
  setState: EditBookAction
  state: EditBookState
}) => {
  return (
    <div style={{ width: '18%', paddingLeft: 15, paddingTop: 15 }}>
      <ul style={{ paddingLeft: 0, listStyle: 'none' }} className="list-item">
        <li>
          <RxReader size={16} color="#2d2d2d" />
          <Link to={`/view/book/${book_id}`}>Read Book</Link>
        </li>
        <li
          onClick={() => {
            setState({
              ...state,
              modal: 'delete_book',
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
