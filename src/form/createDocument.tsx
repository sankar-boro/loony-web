import { useState, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from 'loony-query'
import { AuthContext } from '../context/AuthContext.tsx'
import { TextArea } from './components/TextArea.tsx'
import { MenuNavContainer } from '../components/Containers.tsx'
import { GoHome } from 'react-icons/go'
import { PiBookLight, PiNoteThin } from 'react-icons/pi'
import { PiNotePencilThin } from 'react-icons/pi'
import 'react-easy-crop/react-easy-crop.css'
import AppContext from '../context/AppContext.tsx'
import type { Auth } from 'loony-types'
import UploadImage from './uploadImage.tsx'

export default function CreateNewDocument({
  url,
  title,
  isMobile,
}: {
  url: string
  title: string
  isMobile: boolean
}) {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const appContext = useContext(AppContext)
  const { base_url } = appContext.env

  const { user } = authContext as Auth
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [tags, setTags] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [theme, setTheme] = useState(11)
  const [error, setError] = useState('')
  const [formImages, setFormImages] = useState(null)

  const createDoc = useCallback(async () => {
    if (!formTitle) {
      setError('Title is required')
      return
    }
    if (!formContent) {
      setError('Body is required')
      return
    }
    setSubmitting(true)

    axiosInstance
      .post(url, {
        title: formTitle,
        content: formContent,
        images: formImages ? formImages : [],
        tags: tags.split(' '),
        theme,
      })
      .then(() => {
        setSubmitting(false)
        appContext.setAppContext((prevState) => ({
          ...prevState,
          alert: {
            status: 'success',
            title: 'Created',
            body: 'Created successfully',
          },
        }))
        navigate('/', { replace: true })
      })
      .catch(() => {
        setSubmitting(false)
      })
  }, [formTitle, formContent, tags, theme])

  const routeTo = () => {
    return
  }

  return (
    <div className="form-container flex-row">
      {isMobile ? null : (
        <div
          style={{
            width: '20%',
            borderRight: '1px solid #ccc',
            paddingBottom: 100,
          }}
        >
          <MenuNavContainer
            activeMenu={'active-menu'}
            onClick={routeTo}
            route="/create/book"
          >
            <span style={{ position: 'relative', top: 3 }}>
              <PiNotePencilThin />
            </span>{' '}
            <span style={{ marginLeft: 10 }}>Create</span>
          </MenuNavContainer>
          <MenuNavContainer onClick={routeTo} route="/">
            <span style={{ position: 'relative', top: 3 }}>
              <GoHome />
            </span>
            <span style={{ marginLeft: 10 }}>Home</span>
          </MenuNavContainer>
          <MenuNavContainer onClick={routeTo} route="/books">
            <span style={{ position: 'relative', top: 2 }}>
              <PiBookLight />
            </span>{' '}
            <span style={{ marginLeft: 10 }}>Books</span>
          </MenuNavContainer>
          <MenuNavContainer onClick={routeTo} route="/blogs">
            <span style={{ position: 'relative', top: 2 }}>
              <PiNoteThin />
            </span>{' '}
            <span style={{ marginLeft: 10 }}>Blogs</span>
          </MenuNavContainer>
        </div>
      )}
      <div
        style={{
          width: isMobile ? '100%' : '65%',
          paddingBottom: 100,
          background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 'bold', padding: 45 }}>
          {title}
        </div>
        {error ? (
          <div
            style={{
              color: '#ff4949',
              paddingLeft: 55,
              fontWeight: 'bold',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        ) : null}
        <div style={{ padding: isMobile ? 0 : '0px 45px 15px 45px' }}>
          <div style={{ padding: '0px 10px' }}>
            <div className="form-section">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value)
                }}
                placeholder="Title"
              />
            </div>
            <TextArea
              formContent={formContent}
              setFormContent={setFormContent}
              theme={theme}
              setTheme={setTheme}
            />
            <UploadImage
              baseUrl={base_url}
              user={user}
              setFormImages={setFormImages}
            />
            <div className="form-section">
              <label>Tags</label>
              <br />
              <input
                type="text"
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value)
                }}
              />
            </div>
          </div>
          <div className="flex-row" style={{ justifyContent: 'flex-end' }}>
            <button
              className="black-bg"
              onClick={createDoc}
              disabled={submitting}
              style={{ marginRight: 10 }}
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
            <button
              className="grey-bg"
              data-id="/"
              onClick={routeTo}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
