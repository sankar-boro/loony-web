import React, { useEffect, useState, useContext } from 'react'
import { axiosInstance } from 'loony-query'
import { AuthContext } from '../context/AuthContext.tsx'
import { TextArea } from './components/TextArea.tsx'
import type {
  EditNodeComponentProps,
  AuthContextProps,
  AppContextProps,
} from 'loony-types'
import { getUrl } from 'loony-utils'
import AppContext from '../context/AppContext.tsx'
import UploadImage from './uploadImage.tsx'
import type { Auth } from 'loony-types'

export default function EditNodeComponent(props: EditNodeComponentProps) {
  const {
    state,
    FnCallback,
    onCancel,
    docIdName,
    doc_id,
    url,
    isMobile,
    heading,
  } = props
  const { editNode, mainNode } = state
  if (!editNode || !mainNode) return null
  const authContext = useContext<AuthContextProps>(AuthContext)
  const appContext = useContext<AppContextProps>(AppContext)
  const { base_url } = appContext.env

  const { user } = authContext as Auth

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [theme, setTheme] = useState(11)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editNode) {
      setTitle(editNode.title)
      setContent(editNode.content)
      if (typeof editNode.images === 'string') {
        const __image = JSON.parse(editNode.images)
        if (__image.length > 0) {
          setImage(__image[0].name)
        }
      }
      if (Array.isArray(editNode.images)) {
        setImage(editNode.images[0].name)
      }
      if (editNode.theme) {
        setTheme(editNode.theme)
      }
    }
  }, [editNode])

  const updateNode: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const url__ = getUrl(editNode, mainNode, url)
    e.preventDefault()
    if (!title) {
      setError('Title is required.')
      return
    }
    if (!title) {
      setError('Body is required.')
      return
    }
    const submitData = {
      title,
      content,
      uid: editNode.uid,
      [docIdName]: doc_id,
      identity: editNode.identity ? editNode.identity : null,
      images: image ? [{ name: image }] : [],
      theme,
    }
    axiosInstance
      .post(url__, submitData)
      .then((res) => {
        FnCallback(res.data)
      })
      .catch(() => {
        onCloseModal()
      })
  }
  const onCloseModal = () => {
    setTitle('')
    setContent('')
    onCancel()
  }

  const imageName = docIdName === 'book_id' ? 'book' : 'blog'

  return (
    <div
      style={{
        width: isMobile ? '100%' : '60%',
        paddingLeft: '5%',
        background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
        minHeight: '100vh',
        paddingBottom: '10vh',
      }}
    >
      <h2>{heading}</h2>
      <div style={{}}>
        <div>
          {error ? (
            <div style={{ color: '#ff4949', fontWeight: 'bold', fontSize: 14 }}>
              {error}
            </div>
          ) : null}
          {image ? (
            <img
              src={`${base_url}/api/${imageName}/${user?.uid}/340/${image}`}
              alt="tmp file upload"
            />
          ) : null}
          <div className="form-section">
            <label>Title</label>
            <br />
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
            />
          </div>
          <TextArea
            formBody={content}
            setFormBody={setContent}
            theme={theme}
            setTheme={setTheme}
          />
          <UploadImage
            baseUrl={base_url}
            user={user}
            setFormImages={setImage}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <button onClick={onCloseModal} className="grey-bg">
          Cancel
        </button>
        <button
          onClick={updateNode}
          className="black-bg"
          style={{ marginLeft: 15 }}
        >
          Update
        </button>
      </div>
    </div>
  )
}
