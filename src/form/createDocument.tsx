import { useState, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from 'loony-api'
import { AuthContext } from '../context/AuthContext.tsx'
import { TextArea } from './components/TextArea.tsx'
import { MenuNavContainer } from '../components/Containers.tsx'
import { GoHome } from 'react-icons/go'
import { PiBookLight, PiNoteThin } from 'react-icons/pi'
import MarkdownPreview from '@uiw/react-markdown-preview'
// import MathsMarkdown from '../../components/MathsMarkdown.tsx'

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
            width: '15%',
            paddingBottom: 100,
          }}
        >
          <div
            style={{
              width: '95%',
              marginLeft: '2%',
              marginRight: '2%',
              marginTop: '0.5em',
            }}
          >
            <MenuNavContainer onClick={routeTo} route="/create/book">
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
        </div>
      )}
      <div
        style={{
          width: isMobile ? '100%' : '40%',
          paddingBottom: 100,
        }}
      >
        <h2>{title}</h2>
        <hr />
        {error ? (
          <div
            style={{
              color: '#ff4949',
              fontWeight: 'bold',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        ) : null}
        <div style={{}}>
          <div style={{}}>
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
              className="black-bg shadow"
              onClick={createDoc}
              disabled={submitting}
              style={{ marginRight: 10 }}
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
            <button
              className="white-bg shadow"
              data-id="/"
              onClick={routeTo}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {
            theme === 11 ? (
              formContent
            ) : theme === 24 ? (
              <MarkdownPreview
                source={formContent}
                wrapperElement={{ 'data-color-mode': 'light' }}
              />
            ) : theme === 41 ? null : null // <MathsMarkdown source={formContent} />
          }
        </div>
      </div>
    </div>
  )
}
