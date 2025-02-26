import { deleteOne, deleteSubSection, deleteSection } from 'loony-utils'
import { axiosInstance } from 'loony-api'
import ConfirmAction from '../../components/ConfirmAction.tsx'
import {
  AppDispatchAction,
  EditBookAction,
  EditBookState,
  DocNode,
} from 'loony-types'
import { NavigateFunction } from 'react-router-dom'
import { useCallback } from 'react'


export default function EditModal({
    state,
    setState,
    setAppContext,
    doc_id,
    navigate,
  }: {
    state: EditBookState
    setState: EditBookAction
    setAppContext: AppDispatchAction
    doc_id: number
    navigate: NavigateFunction
    isMobile: boolean
  }) {
    const { modal } = state
    const {
        deleteNode,
        navNodes,
        groupNodesById,
        childNodes,
        parentNode,
      } = state
    
  const onDeleteNode = () => {
    if (!deleteNode || !parentNode) return
    const submitData = {
      identity: deleteNode.identity,
      parent_id: deleteNode.parent_id,
      delete_id: deleteNode.uid,
    }
    axiosInstance
      .post(`/book/delete/node`, submitData)
      .then((res) => {
        if (deleteNode.identity === 101) {
          const __navNodes = deleteOne(navNodes, res.data)
          setState({
            ...state,
            parentNode: groupNodesById[doc_id],
            childNodes: groupNodesById[doc_id].child as DocNode[],
            navNodes: __navNodes,
            deleteNode: null,
            form: '',
          })
        }
        if (deleteNode.identity === 102) {
          const newNavNodes: DocNode[] = deleteSection(navNodes, res.data)
          delete groupNodesById[deleteNode.uid]
          setState({
            ...state,
            navNodes: newNavNodes,
            parentNode: groupNodesById[doc_id],
            childNodes: groupNodesById[doc_id].child as DocNode[],
            deleteNode: null,
            form: '',
          })
        }
        if (deleteNode.identity === 103) {
          const child = deleteSubSection(childNodes, res.data)
          setState({
            ...state,
            groupNodesById: {
              ...groupNodesById,
              [parentNode?.uid as number]: {
                ...parentNode,
                child: child,
              },
            },
            childNodes: child,
            form: '',
            deleteNode: null,
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const deleteBook = () => {
    axiosInstance.post('/book/delete', { doc_id: doc_id }).then(() => {
      setAppContext((prevState) => ({
        ...prevState,
        alert: {
          status: 'success',
          title: 'Deleted Book',
          body: 'Your book has been successfully deleted.',
        },
      }))
      navigate('/', { replace: true })
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
    return <>

      {modal && modal === 'delete_book' ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Book?"
          confirmAction={deleteBook}
          title="Delete Book"
          onCancel={onCancel}
        />
      ) : null}

      {modal && modal === 'delete_page' ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Page?"
          confirmAction={onDeleteNode}
          title="Delete Page"
          onCancel={onCancel}
        />
      ) : null}

      {modal && modal === 'delete_node' ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Node?"
          confirmAction={onDeleteNode}
          title="Delete Node"
          onCancel={onCancel}
        />
      ) : null}
    </>
}