import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { extractImage, timeAgo } from 'loony-utils'
import PageLoadingContainer from '../../components/PageLoadingContainer.tsx'
import { getBlogNodes } from 'loony-utils'
import { Chapters, Edit as EditPage } from '../common/BlogPageNavigation.tsx'
import { AppRouteProps, ReadBlogState, PageStatus } from 'loony-types'
import BasicMarkdown from '../../components/BasicMarkdown.tsx'

const View = (props: AppRouteProps) => {
  const { isMobile, setMobileNavOpen, mobileNavOpen, appContext, authContext } =
    props
  const { base_url } = appContext.env
  const { blogId } = useParams()
  const blog_id = blogId && parseInt(blogId)

  const [state, setState] = useState<ReadBlogState>({
    mainNode: null,
    childNodes: [],
    topNode: null,
    doc_id: blog_id as number,
  })
  const [status, setStatus] = useState({
    status: PageStatus.IDLE,
    error: '',
  })

  useEffect(() => {
    if (blog_id) {
      getBlogNodes(blog_id, setState, setStatus)
    }
  }, [blog_id])

  if (status.status !== PageStatus.VIEW_PAGE)
    return <PageLoadingContainer isMobile={isMobile} />

  const { childNodes, mainNode } = state
  if (!mainNode || !mainNode) return null

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
              <Chapters state={state} />
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
            <Chapters state={state} />
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
                <div className="username">{timeAgo(mainNode.created_at)}</div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <BasicMarkdown source={mainNode.content} />
            </div>
          </div>
          {childNodes.map((blogNode) => {
            const parseImage = JSON.parse(blogNode.images as string)
            const nodeImage = parseImage.length > 0 ? parseImage[0].name : null
            return (
              <div className="page-section" key={blogNode.uid}>
                <div className="section-title">{blogNode.title}</div>
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
                  <BasicMarkdown source={blogNode.content} />
                </div>
              </div>
            )
          })}
          <div style={{ height: 50 }} />
        </div>
        {!isMobile ? (
          <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
            <EditPage
              blog_id={blog_id as number}
              authContext={authContext}
              mainNode={mainNode}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default View
