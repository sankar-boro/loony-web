import { useState, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from 'loony-query'
import { AuthContext } from '../context/AuthContext.tsx'
import Cropper from 'react-easy-crop'
import { TextArea } from './components/TextArea.tsx'
import { MenuNavContainer } from '../components/Containers.tsx'
import { GoHome } from 'react-icons/go'
import { PiBookLight, PiNoteThin } from 'react-icons/pi'
import { PiNotePencilThin } from 'react-icons/pi'
import 'react-easy-crop/react-easy-crop.css'
import AppContext from '../context/AppContext.tsx'
import type {
  Auth,
  AfterImageSelect,
  CropImageMetadata,
  EditImageComponentProps,
} from 'loony-types'

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
  const [formBody, setFormBody] = useState('')
  const [tags, setTags] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [theme, setTheme] = useState(11)
  const [error, setError] = useState('')

  const [afterImageSelect, setAfterImageSelect] = useState<AfterImageSelect>({
    image: null,
    width: null,
    height: null,
    hasImage: false,
  })
  const [afterTmpImageUpload, setAfterTmpImageUpload] = useState('')
  const [imageEdit, setImageEdit] = useState<null | string>(null)
  const [cropImageMetadata, setCropImageMetadata] = useState<CropImageMetadata>(
    {
      width: null,
      height: null,
      x: null,
      y: null,
    }
  )

  const createDoc = useCallback(async () => {
    let imageData = null
    if (afterImageSelect.image) {
      imageData = await uploadImage()
    }
    if (!formTitle) {
      setError('Title is required')
      return
    }
    if (!formBody) {
      setError('Body is required')
      return
    }
    setSubmitting(true)
    axiosInstance
      .post(url, {
        title: formTitle,
        body: formBody,
        images: [{ name: imageData ? imageData.name : afterTmpImageUpload }],
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
  }, [formTitle, formBody, tags, afterTmpImageUpload, theme])

  const onSelectImage: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files &&
      event.target.files.length > 0 &&
      event.target.files[0]
    if (!selectedFile) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = function () {
        const width = img.naturalWidth
        const height = img.naturalHeight
        if (width > height && width <= 1420) {
          return
        }
        if (height > width && height <= 1420) {
          return
        }
        setAfterImageSelect({
          hasImage: true,
          image: selectedFile,
          width,
          height,
        })
        setImageEdit(URL.createObjectURL(selectedFile))
      }
      if (e.target?.result && typeof e.target.result === 'string') {
        img.src = e.target.result
      }
    }
    reader.readAsDataURL(selectedFile)
  }

  const changeFile = onSelectImage
  const routeTo = (e: any) => {
    navigate(e.target.dataset.id)
  }
  const uploadImage = async () => {
    const formData = new FormData()
    formData.append(
      'metadata',
      JSON.stringify({
        oriImgMd: afterImageSelect,
        cropImgMd: cropImageMetadata,
      })
    )
    formData.append('file', afterImageSelect.image as File)

    const { data } = await axiosInstance.post('/upload_file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    setAfterTmpImageUpload(data.name)
    setImageEdit('')
    return data
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
              formBody={formBody}
              setFormBody={setFormBody}
              theme={theme}
              setTheme={setTheme}
            />
            {!afterTmpImageUpload && imageEdit ? (
              <EditImageComponent
                uploadImage={uploadImage}
                changeFile={changeFile}
                imageEdit={imageEdit}
                setCropImageMetadata={setCropImageMetadata}
              />
            ) : null}
            {!afterTmpImageUpload && !imageEdit ? (
              <SelectImage onSelectImage={onSelectImage} />
            ) : null}
            {afterTmpImageUpload && !imageEdit ? (
              <img
                src={`${base_url}/api/tmp/${user?.uid}/340/${afterTmpImageUpload}`}
                alt="tmp file upload"
              />
            ) : null}
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

const EditImageComponent = (props: EditImageComponentProps) => {
  const { uploadImage, changeFile, imageEdit, setCropImageMetadata } = props
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspectRatio, setAspectRatio] = useState({
    width: 4,
    height: 3,
  })

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCropImageMetadata(croppedAreaPixels)
  }

  return (
    <div className="form-section">
      <label>Image</label>
      <div
        style={{
          border: '1px dashed #ccc',
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', width: '100%', minHeight: 350 }}>
            <Cropper
              image={imageEdit as string}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio.width / aspectRatio.height}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <label>Choose another file</label>
          <br />
          <div className="flex-row">
            <button
              onClick={() => {
                setAspectRatio({ width: 4, height: 3 })
              }}
            >
              4/3
            </button>
            <button
              onClick={() => {
                setAspectRatio({ width: 9, height: 16 })
              }}
            >
              9/16
            </button>
          </div>
          <input
            type="file"
            onChange={changeFile}
            style={{
              backgroundColor: 'white',
              border: 'none',
              padding: 0,
              margin: 0,
              marginTop: 20,
              borderRadius: 15,
              width: '50%',
            }}
          />
          <button onClick={uploadImage}>Upload</button>
        </div>
      </div>
    </div>
  )
}

const SelectImage = ({
  onSelectImage,
}: {
  onSelectImage: React.ChangeEventHandler<HTMLInputElement>
}) => {
  return (
    <div className="form-section">
      <label>Image</label>
      <div
        style={{
          border: '1px dashed #ccc',
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <label>Drop file here</label>
          <br />
          <span>or</span>
          <input
            type="file"
            onChange={onSelectImage}
            style={{
              backgroundColor: 'white',
              border: 'none',
              padding: 0,
              margin: 0,
              marginTop: 20,
              borderRadius: 15,
              width: '50%',
            }}
          />
        </div>
      </div>
    </div>
  )
}
