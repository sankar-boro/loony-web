import { useState, useCallback, useContext } from 'react'
import { axiosInstance } from 'loony-query'
import { AuthContext } from '../context/AuthContext.tsx'
import { TextArea } from './components/TextArea.tsx'
import 'react-easy-crop/react-easy-crop.css'
import type {
  AuthContextProps,
  AppContextProps,
  AddNodeComponentProps,
} from 'loony-types'
import AppContext from '../context/AppContext.tsx'
import UploadImage from './uploadImage.tsx'
import type { Auth } from 'loony-types'

export default function AddNodeComponent(props: AddNodeComponentProps) {
  const {
    url,
    heading,
    docIdName,
    doc_id,
    FnCallback,
    parent_id,
    identity,
    page_id,
    onCancel,
    parent_identity,
    isMobile,
  } = props

  const authContext = useContext<AuthContextProps>(AuthContext)
  const appContext = useContext<AppContextProps>(AppContext)
  const { base_url } = appContext.env

  const { user } = authContext as Auth
  const [formTitle, setFormTitle] = useState('')
  const [formBody, setFormBody] = useState('')
  const [theme, setTheme] = useState(11)
  const [error, setError] = useState('')
  const [formImages, setFormImages] = useState(null)

  const onCreateAction = useCallback(async () => {
    if (!formTitle) {
      setError('Title is required.')
      return
    }
    if (!formBody) {
      setError('Body is required.')
      return
    }
    axiosInstance
      .post(url, {
        title: formTitle,
        body: formBody,
        images: formImages,
        tags: null,
        [docIdName]: doc_id,
        parent_id,
        identity,
        page_id,
        theme,
        parent_identity,
      })
      .then(({ data }) => {
        FnCallback(data)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [formTitle, formBody])

  return (
    <div
      style={{
        width: isMobile ? '100%' : '60%',
        paddingLeft: '5%',
        background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
        minHeight: '100vh',
      }}
    >
      <div style={{}}>
        <h2>{heading}</h2>
        <div>
          {error ? (
            <div style={{ color: '#ff4949', fontWeight: 'bold', fontSize: 14 }}>
              {error}
            </div>
          ) : null}
          <div className="form-section">
            <label>Title</label>
            <br />
            <input
              type="text"
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value)
              }}
            />
          </div>
          <TextArea
            formBody={formBody}
            setFormBody={setFormBody}
            theme={theme}
            setTheme={setTheme}
          />
          <UploadImage
            baseUrl={base_url}
            user={user}
            setFormImages={setFormImages}
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
        <button
          onClick={onCancel}
          className="grey-bg"
          style={{ marginRight: 10 }}
        >
          Cancel
        </button>
        <button onClick={onCreateAction} className="black-bg">
          Submit
        </button>
      </div>
    </div>
  )
}
