import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { extractImage } from "loony-utils"
import PageLoadingContainer from "../../components/PageLoadingContainer.tsx"
import { getBlogNodes } from "loony-utils"
import { AppRouteProps, ReadBlogState, PageStatus } from "loony-types"
import BasicMarkdown from "../../components/BasicMarkdown.tsx"
import NodeInfo from "../../components/NodeInfo.tsx"
import Nav from "../../nav/blog/index.tsx"
import RightNav from "../../nav/blog/RightNav.tsx"

const View = (props: AppRouteProps) => {
  const { isMobile, appContext, authContext } = props
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
    error: "",
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
    <div className="flex-row full-con">
      <Nav state={state} {...props} />
      <div className="con-sm-12 con-xxl-5 mar-hor-1">
        <div style={{ marginBottom: 24 }}>
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
                <div style={{ width: "100%", borderRadius: 5 }}>
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
        <div style={{ width: "20%", paddingLeft: 15, paddingTop: 15 }}>
          <RightNav
            blog_id={blog_id as number}
            authContext={authContext}
            mainNode={mainNode}
          />
        </div>
      ) : null}
    </div>
  )
}

export default View
