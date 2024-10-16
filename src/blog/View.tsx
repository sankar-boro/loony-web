import { useState, useEffect, lazy, Suspense } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { Link, useParams } from 'react-router-dom'
import { extractImage, timeAgo } from 'loony-utils'
import { LuFileWarning } from 'react-icons/lu'
import { LuFileEdit } from 'react-icons/lu'
import PageLoadingContainer from '../components/PageLoadingContainer.tsx'
import { getNodes } from './utils.ts'
import { PageNavigationEdit } from './pageNavigation.tsx'
import { ApiEvent } from 'loony-types'
import { AppRouteProps, ReadState } from 'types/index.ts'
const MathsMarkdown = lazy(() => import('../components/MathsMarkdown.tsx'))

const View = (props: AppRouteProps) => {
  const { isMobile, setMobileNavOpen, mobileNavOpen, appContext } = props
  const { base_url } = appContext.env
  const { blogId } = useParams()
  const blog_id = blogId && parseInt(blogId)

  const [state, setState] = useState<ReadState>({
    doc_info: null,
    pageId: null,
    mainNode: null,
    activeNode: null,
    nodeIndex: null,
    rawNodes: [],
    blogNodes: [],
    childNodes: [],
  })
  const [status, setStatus] = useState({
    status: ApiEvent.IDLE,
    error: '',
  })

  useEffect(() => {
    if (blog_id) {
      getNodes(blog_id, setState, setStatus)
    }
  }, [blog_id])

  if (status.status === ApiEvent.IDLE || status.status === ApiEvent.START)
    return <PageLoadingContainer isMobile={isMobile} />

  const { childNodes, mainNode, doc_info } = state
  const image = extractImage(mainNode.images)

  return (
    <div className="book-container">
      <div style={{ display: 'flex', flexDirection: 'row' }}>
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
              <PageNavigationEdit
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
              width: '15%',
              paddingTop: 15,
              borderRight: '1px solid #ebebeb',
            }}
          >
            <PageNavigationEdit
              blog_id={blog_id as number}
              state={state}
              isMobile={isMobile}
            />
          </div>
        ) : null}

        <div
          style={{
            width: isMobile ? '100%' : '50%',
            paddingTop: 15,
            paddingLeft: '5%',
            paddingRight: '5%',
            background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
            marginBottom: 24,
            minHeight: '110vh',
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div className="page-heading">{mainNode.title}</div>
            {image && image.name ? (
              <div style={{ width: '100%', borderRadius: 5 }}>
                <img
                  src={`${base_url}/api/blog/${blog_id}/720/${image.name}`}
                  alt=""
                  width="100%"
                />
              </div>
            ) : null}

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
                <div className="username">{timeAgo(doc_info.created_at)}</div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              {mainNode.theme === 11 ? (
                mainNode.body
              ) : mainNode.theme === 24 ? (
                <MarkdownPreview
                  source={mainNode.body}
                  wrapperElement={{ 'data-color-mode': 'light' }}
                />
              ) : mainNode.theme === 41 ? (
                <Suspense fallback={<div>Loading component...</div>}>
                  <MathsMarkdown source={mainNode.body} />
                </Suspense>
              ) : null}
            </div>
          </div>
          {childNodes.map((blog_node) => {
            const parseImage = JSON.parse(blog_node.images)
            const nodeImage = parseImage.length > 0 ? parseImage[0].name : null
            return (
              <div className="page-section" key={blog_node.uid}>
                <div className="section-title">{blog_node.title}</div>
                {nodeImage ? (
                  <div style={{ width: '100%', borderRadius: 5 }}>
                    <img
                      src={`${base_url}/api/blog/${blog_id}/720/${nodeImage}`}
                      alt=""
                      width="100%"
                    />
                  </div>
                ) : null}
                <div>
                  {blog_node.theme === 11 ? (
                    blog_node.body
                  ) : blog_node.theme === 24 ? (
                    <MarkdownPreview
                      source={blog_node.body}
                      wrapperElement={{ 'data-color-mode': 'light' }}
                    />
                  ) : blog_node.theme === 41 ? (
                    <Suspense fallback={<div>Loading component...</div>}>
                      <MathsMarkdown source={blog_node.body} />
                    </Suspense>
                  ) : null}
                </div>
              </div>
            )
          })}
          <div style={{ height: 50 }} />
        </div>
        {!isMobile ? (
          <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
            <ul
              style={{ paddingLeft: 0, listStyle: 'none' }}
              className="list-item"
            >
              <li>
                <LuFileEdit color="#2d2d2d" size={16} />
                <Link to={`/edit/blog/${blog_id}`}>Edit this page</Link>
              </li>
              <li>
                <LuFileWarning color="#2d2d2d" size={16} />
                <Link to="">Report</Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default View
