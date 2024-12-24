/* eslint-disable @typescript-eslint/no-unused-vars */
import MarkdownPreview from '@uiw/react-markdown-preview'

import { Suspense, useCallback } from 'react'
import {
  deleteBlogNode,
  extractImage,
  updateBlogNode,
  appendBlogNode,
  timeAgo,
  orderBlogChildNodes,
} from 'loony-utils'
import { RxReader } from 'react-icons/rx'
import { AiOutlineDelete } from 'react-icons/ai'
import { LuFileWarning } from 'react-icons/lu'
import { MdAdd, MdOutlineEdit, MdContentCopy } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'

import { axiosInstance } from 'loony-api'
import AddNode from '../../form/addNode.tsx'
import EditNodeForm from '../../form/editNode.tsx'
import ConfirmAction from '../../components/ConfirmAction.tsx'
import { Chapters } from '../common/BlogPageNavigation.tsx'
import {
  AppendNodeResponse,
  AppRouteProps,
  EditBlogState,
  EditBlogAction,
  AuthContextProps,
} from 'loony-types'
import { DocNode, DocStatus } from 'loony-types'

// const MathsMarkdown = lazy(() => import('../../components/MathsMarkdown.tsx'))

export default function RenderComponent({
  props,
  state,
  blog_id,
  setState,
}: // authContext,
{
  props: AppRouteProps
  state: EditBlogState
  blog_id: number
  setState: React.Dispatch<React.SetStateAction<EditBlogState>>
  authContext: AuthContextProps
}) {
  const base_url = props.appContext.env.base_url
  const { isMobile, mobileNavOpen, setMobileNavOpen } = props
  const { mainNode, childNodes } = state

  if (!mainNode || !mainNode) return null

  const image = extractImage(mainNode.images)

  return (
    <div className="book-container">
      <div className="flex-row">
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
        {state.modal ? (
          <ActivityComponent
            state={state}
            setState={setState}
            blog_id={blog_id as number}
            isMobile={isMobile}
          />
        ) : (
          <div
            style={{
              width: isMobile ? '90%' : '50%',
              paddingLeft: '5%',
              paddingRight: '5%',
              paddingBottom: '10vh',
              background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
              minHeight: '110vh',
            }}
          >
            <div>
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
                {/* {mainNode.theme === 11 ? (
                  mainNode.content
                ) : mainNode.theme === 24 ? (
                  <MarkdownPreview
                    source={mainNode.content}
                    wrapperElement={{ 'data-color-mode': 'light' }}
                  />
                ) : mainNode.theme === 41 ? (
                  <Suspense fallback={<div>Loading component...</div>}>
                    <MathsMarkdown source={mainNode.content} />
                  </Suspense>
                ) : null} */}
                <Suspense fallback={<div>Loading component...</div>}>
                  <MarkdownPreview source={mainNode.content} />
                </Suspense>
              </div>
            </div>
            {/* Main node settings */}
            <div className="flex-row" style={{ marginTop: 24 }}>
              <div
                className="button-none cursor"
                onClick={() => {
                  setState({
                    ...state,
                    status: DocStatus.CreateNode,
                    addNode: mainNode,
                    modal: 'add_node',
                  })
                }}
                style={{ marginRight: 10 }}
              >
                <div className="btn-action">
                  <MdAdd size={16} color="#9c9c9c" />
                </div>
              </div>
              <div
                className="button-none cursor"
                onClick={() => {
                  setState({
                    ...state,
                    status: DocStatus.DeleteNode,
                    editNode: mainNode,
                    modal: 'edit_node',
                  })
                }}
                style={{ marginRight: 16 }}
              >
                <div className="btn-action">
                  <MdOutlineEdit size={16} color="#9c9c9c" />
                </div>
              </div>
              <div
                className="button-none cursor"
                onClick={(e) => {
                  navigator.clipboard.writeText(mainNode.content)
                  e.stopPropagation()
                }}
                style={{ marginRight: 16 }}
              >
                <div className="btn-action">
                  <MdContentCopy size={16} color="#9c9c9c" />
                </div>
              </div>
            </div>
            {/* End main node settings */}

            <div
              style={{
                marginTop: 16,
              }}
            >
              {mainNode.identity !== 101 &&
                childNodes.map((node, nodeIndex) => {
                  const parseImage = JSON.parse(node.images as string)
                  const nodeImage =
                    parseImage.length > 0 ? parseImage[0].name : null
                  return (
                    <div
                      style={{ marginBottom: 50, marginTop: 50 }}
                      key={node.uid}
                    >
                      <div className="section-title">{node.title}</div>
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
                        {/* {node.theme === 11 ? (
                          node.content
                        ) : node.theme === 24 ? (
                          <MarkdownPreview
                            source={node.content}
                            wrapperElement={{ 'data-color-mode': 'light' }}
                          />
                        ) : node.theme === 41 ? (
                          <Suspense fallback={<div>Loading component...</div>}>
                            <MathsMarkdown source={node.content} />
                          </Suspense>
                        ) : null} */}
                        <Suspense fallback={<div>Loading component...</div>}>
                          <MarkdownPreview source={node.content} />
                        </Suspense>
                      </div>

                      {/* Node settings */}
                      <div className="flex-row" style={{ marginTop: 24 }}>
                        <div
                          className="button-none cursor"
                          onClick={() => {
                            setState({
                              ...state,
                              addNode: node,
                              modal: 'add_node',
                            })
                          }}
                          style={{ marginRight: 16 }}
                        >
                          <div className="btn-action">
                            <MdAdd size={16} color="#9c9c9c" />
                          </div>
                        </div>
                        <div
                          className="button-none cursor"
                          onClick={() => {
                            setState({
                              ...state,
                              editNode: node,
                              modal: 'edit_node',
                            })
                          }}
                          style={{ marginRight: 16 }}
                        >
                          <div className="btn-action">
                            <MdOutlineEdit size={16} color="#9c9c9c" />
                          </div>
                        </div>
                        <div
                          className="delete-button-none cursor"
                          onClick={() => {
                            setState({
                              ...state,
                              deleteNode: node,
                              nodeIndex,
                              modal: 'delete_node',
                            })
                          }}
                          style={{ marginRight: 16 }}
                        >
                          <div className="btn-action">
                            <AiOutlineDelete size={16} color="#9c9c9c" />
                          </div>
                        </div>
                        <div
                          className="button-none cursor"
                          onClick={(e) => {
                            navigator.clipboard.writeText(node.content)
                            e.stopPropagation()
                          }}
                          style={{ marginRight: 16 }}
                        >
                          <div className="btn-action">
                            <MdContentCopy size={16} color="#9c9c9c" />
                          </div>
                        </div>
                      </div>

                      {/* Node settings end */}
                    </div>
                  )
                })}
            </div>
          </div>
        )}
        {!isMobile ? (
          <RightBlogContainer
            blog_id={blog_id as number}
            setState={setState}
            state={state}
          />
        ) : null}
      </div>
    </div>
  )
}
const ActivityComponent = ({
  state,
  setState,
  blog_id,
  isMobile,
}: {
  state: EditBlogState
  setState: EditBlogAction
  blog_id: number
  isMobile: boolean
}) => {
  const { parentNode, childNodes, modal, nodeIndex, mainNode, addNode } = state

  if (!mainNode) return null

  const navigate = useNavigate()

  const deleteNode = () => {
    if (!state.deleteNode) return
    const delete_node = state.deleteNode
    if (childNodes) {
      let updateNode: DocNode | undefined
      childNodes.forEach((r) => {
        if (r.parent_id === delete_node.uid) {
          updateNode = r
        }
      })

      const submitData = {
        delete_node: {
          identity: delete_node.identity,
          uid: delete_node.uid,
        },
        update_node: updateNode
          ? {
              parent_id: delete_node.parent_id,
              uid: updateNode ? updateNode.uid : null,
            }
          : null,
      }

      axiosInstance
        .post(`/blog/delete/node`, submitData)
        .then(() => {
          const nodesAfterDelete = deleteBlogNode(childNodes, submitData)
          const orderChildNodes = orderBlogChildNodes(
            nodesAfterDelete,
            mainNode
          )

          setState({
            ...state,
            childNodes: orderChildNodes,
            modal: '',
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const deleteBlog = useCallback(() => {
    axiosInstance.post('/blog/delete', { blog_id }).then(() => {
      navigate('/', { replace: true })
    })
  }, [])

  const editFnCallback = useCallback(
    (data: DocNode) => {
      const nodesAfterUpdate = updateBlogNode(childNodes, data)
      const orderChildNodes = orderBlogChildNodes(nodesAfterUpdate, mainNode)
      const newChildNodes =
        orderChildNodes.length >= 2 ? orderChildNodes.slice(1) : []

      setState({
        ...state,
        childNodes: newChildNodes,
        modal: '',
      })
    },
    [state.status]
  )

  const addNodeCbFn = (data: AppendNodeResponse) => {
    if (!addNode) return
    const nodesAfterAdd = appendBlogNode(childNodes, addNode, data, mainNode)
    const newChildNodes = orderBlogChildNodes(nodesAfterAdd, mainNode)

    setState({
      ...state,
      addNode: null,
      childNodes: newChildNodes,
      modal: '',
    })
  }

  const onCancel = useCallback(() => {
    setState({
      ...state,
      modal: '',
      editNode: null,
      addNode: null,
    })
  }, [])

  return (
    <>
      {modal === 'add_node' && state.addNode ? (
        <AddNode
          heading="Add Node"
          FnCallback={addNodeCbFn}
          url="/blog/append/node"
          isMobile={isMobile}
          docIdName="blog_id"
          doc_id={blog_id}
          parent_id={state.addNode.uid}
          identity={101}
          onCancel={onCancel}
          page_id={mainNode.uid as number}
          parent_identity={state.addNode.uid}
        />
      ) : null}
      {modal === 'delete_node' && state.deleteNode ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Node?"
          confirmAction={deleteNode}
          title="Delete Node"
          onCancel={onCancel}
        />
      ) : null}

      {modal === 'edit_node' && state.editNode ? (
        <EditNodeForm
          heading="Edit Node"
          state={state}
          docIdName="blog_id"
          doc_id={blog_id}
          FnCallback={editFnCallback}
          onCancel={onCancel}
          url="/blog/edit"
          isMobile={isMobile}
        />
      ) : null}

      {modal === 'delete_blog' ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Blog?"
          confirmAction={deleteBlog}
          title="Delete Blog"
          onCancel={onCancel}
        />
      ) : null}
    </>
  )
}

const RightBlogContainer = ({
  blog_id,
  setState,
  state,
}: {
  blog_id: number
  setState: EditBlogAction
  state: EditBlogState
}) => {
  return (
    <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
      <ul style={{ paddingLeft: 0, listStyle: 'none' }} className="list-item">
        <li>
          <RxReader size={16} color="#2d2d2d" />
          <Link to={`/view/blog/${blog_id}`}>Read Blog</Link>
        </li>
        <li
          onClick={() => {
            setState({
              ...state,
              modal: 'delete_blog',
            })
          }}
        >
          <AiOutlineDelete size={16} color="#2d2d2d" />
          <Link to="#">Delete Blog</Link>
        </li>
        <li>
          <LuFileWarning size={16} color="#2d2d2d" />
          <Link to="#">Report</Link>
        </li>
      </ul>
    </div>
  )
}
