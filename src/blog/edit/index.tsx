import { useState, useEffect, lazy } from 'react'
import { useParams } from 'react-router-dom'
import PageLoadingContainer from '../../components/PageLoadingContainer.tsx'
import { getBlogNodes } from 'loony-utils'
import { AppRouteProps, EditBlogState } from 'loony-types'
import { ApiEvent, DocStatus } from 'loony-types'
const EditRenderComponent = lazy(() => import('./Edit.tsx'))

export default function Edit(props: AppRouteProps) {
  const { blogId } = useParams()
  const blog_id = blogId && parseInt(blogId)

  const [state, setState] = useState<EditBlogState>({
    status: DocStatus.None,
    doc_info: null,
    mainNode: null,
    activeNode: null,
    addNode: null,
    editNode: null,
    nodeIndex: null,
    topNode: null,
    doc_id: blog_id as number,
    rawNodes: [],
    childNodes: [],
    modal: '',
    deleteNode: null,
  })
  const [status, setStatus] = useState({
    status: ApiEvent.IDLE,
    error: '',
  })

  useEffect(() => {
    if (blog_id) {
      getBlogNodes(blog_id, setState, setStatus)
    }
  }, [blog_id])

  if (status.status === ApiEvent.IDLE || status.status === ApiEvent.START)
    return <PageLoadingContainer isMobile={props.isMobile} />

  return (
    <EditRenderComponent
      state={state}
      props={props}
      blog_id={blog_id as number}
      setState={setState}
    />
  )
}
