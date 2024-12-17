import { useState, useEffect, useMemo } from 'react'
import { LuFileWarning, LuFileEdit } from 'react-icons/lu'
import { extractImage, getChapters } from 'loony-utils'

import { useParams, Link } from 'react-router-dom'
import { timeAgo } from 'loony-utils'
import { PageNavigation } from '../common/pageNavigation.tsx'
import PageLoadingContainer from '../../components/PageLoadingContainer.tsx'
import { AppRouteProps, ReadBookState } from 'loony-types'
import { ApiEvent } from 'loony-types'
import BasicMarkdown from '../../components/BasicMarkdown.tsx'

const View = ({
  mobileNavOpen,
  setMobileNavOpen,
  isMobile,
  appContext,
}: AppRouteProps) => {
  const isDesktop = !isMobile
  const { base_url } = appContext.env
  const { bookId } = useParams()
  const book_id = bookId && parseInt(bookId)
  const [pageStatus, setStatus] = useState({
    status: ApiEvent.INIT,
    error: '',
  })

  const [state, setState] = useState<ReadBookState>({
    mainNode: null,
    activeNode: null,
    page_id: null,
    section_id: null,
    activeSectionsByPageId: [],
    activeSubSectionsBySectionId: [],
    allSectionsByPageId: {},
    allSubSectionsBySectionId: {},
    nodes101: [],
    frontPage: null,
  })

  useEffect(() => {
    if (book_id) {
      getChapters(book_id, setState, setStatus)
    }
  }, [book_id])

  const viewFrontPage = () => {
    setState({
      ...state,
      page_id: state.frontPage?.uid || null,
      activeNode: frontPage,
      activeSubSectionsBySectionId: [],
    })
  }

  const {
    activeNode,
    nodes101,
    frontPage,
    activeSubSectionsBySectionId,
    mainNode,
  } = state

  const image = useMemo(
    () => extractImage(activeNode?.images),
    [activeNode?.images]
  )

  if (
    pageStatus.status === ApiEvent.INIT ||
    pageStatus.status === ApiEvent.START
  )
    return <PageLoadingContainer isMobile={isMobile} />

  if (!activeNode || !mainNode || !frontPage) return null

  return (
    <div className="book-container">
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {/*
         * @ Left Navigation
         */}
        {isMobile && mobileNavOpen ? (
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
                nodes101={nodes101}
                state={state}
                book_id={book_id as number}
                isMobile={isMobile}
                viewFrontPage={viewFrontPage}
              />
            </div>
          </div>
        ) : null}
        {isDesktop ? (
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
              nodes101={nodes101}
              state={state}
              book_id={book_id as number}
              isMobile={isMobile}
              viewFrontPage={viewFrontPage}
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
            width: isMobile ? '90%' : '50%',
            paddingTop: 15,
            paddingLeft: '5%',
            paddingRight: '5%',
            background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
            minHeight: '100vh',
          }}
        >
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <div className="page-heading">{activeNode.title}</div>
            {image && image.name ? (
              <div style={{ width: '100%', borderRadius: 5 }}>
                <img
                  src={`${base_url}/api/book/${book_id}/720/${image.name}`}
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
                  <div className="username">{timeAgo(mainNode.created_at)}</div>
                </div>
              </div>
            ) : null}

            <div style={{ marginTop: 16 }}>
              <BasicMarkdown source={activeNode.content} />
            </div>
          </div>
          {activeSubSectionsBySectionId.map((subSectionNode) => {
            const nodeImage = extractImage(subSectionNode.images)
            return (
              <div className="page-section" key={subSectionNode.uid}>
                <div className="section-title">{subSectionNode.title}</div>
                {nodeImage && nodeImage.name ? (
                  <div style={{ width: '100%', borderRadius: 5 }}>
                    <img
                      src={`${base_url}/api/book/${book_id}/720/${nodeImage.name}`}
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
        {isDesktop ? <RightBookContainer book_id={book_id as number} /> : null}
      </div>
    </div>
  )
}

const RightBookContainer = ({ book_id }: { book_id: number }) => {
  return (
    <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
      <ul className="list-item" style={{ paddingLeft: 0, listStyle: 'none' }}>
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
  )
}

export default View
