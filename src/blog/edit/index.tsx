import { useState, useEffect, lazy } from 'react'
import { useParams } from 'react-router-dom'
import PageLoadingContainer from '../../components/PageLoadingContainer.tsx'
import { getBlogNodes } from 'loony-utils'
import { AppRouteProps, EditBlogState, PageStatus } from 'loony-types'
const EditRenderComponent = lazy(() => import('./Edit.tsx'))

export default function Edit(props: AppRouteProps) {
  const { blogId } = useParams()
  const blog_id = blogId && parseInt(blogId)

  const [state, setState] = useState<EditBlogState>({
    mainNode: null,
    parentNode: null,
    addNode: null,
    editNode: null,
    nodeIndex: null,
    topNode: null,
    doc_id: blog_id as number,
    childNodes: [],
    modal: '',
    deleteNode: null,
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
    return <PageLoadingContainer isMobile={props.isMobile} />

  return (
    <EditRenderComponent
      state={state}
      props={props}
      blog_id={blog_id as number}
      setState={setState}
      authContext={props.authContext}
    />
  )
}
