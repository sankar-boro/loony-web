import React, { useEffect, useState, useContext } from 'react'
import { axiosInstance } from 'loony-query'
import Cropper, { Area } from 'react-easy-crop'
import { AuthContext } from '../context/AuthContext.tsx'
import { TextArea } from './components/TextArea.tsx'
import type {
  EditNodeComponentProps,
  AfterImageSelect,
  CropImageMetadata,
  EditImageComponentProps,
  AuthContextProps,
  AppContextProps,
} from 'loony-types'
import { getUrl } from 'loony-utils'
import AppContext from '../context/AppContext.tsx'

export default function EditNodeComponent(props: EditNodeComponentProps) {
  const {
    state,
    FnCallback,
    onCancel,
    doc_idName,
    doc_id,
    url,
    isMobile,
    heading,
  } = props
  const { editNode, mainNode } = state
  if (!editNode || !mainNode) return null
  const auth = useContext<AuthContextProps>(AuthContext)
  const { env } = useContext<AppContextProps>(AppContext)
  const { base_url } = env
  const user_id = auth.user?.uid
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState('')
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

  useEffect(() => {
    if (editNode) {
      setTitle(editNode.title)
      setBody(editNode.body)
      setBody(editNode.body)
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
      body,
      uid: editNode.uid,
      [doc_idName]: doc_id,
      identity: editNode.identity ? editNode.identity : null,
      images: [{ name: afterTmpImageUpload ? afterTmpImageUpload : image }],
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
    setBody('')
    onCancel()
  }
  const onSelectImage: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files &&
      event.target.files.length > 0 &&
      event.target.files[0]
    if (!selectedFile) return
    const reader = new FileReader()
    // FileReader.onload: (l
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

  const imageName = doc_idName === 'book_id' ? 'book' : 'blog'

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
              src={`${base_url}/api/${imageName}/${user_id}/340/${image}`}
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
            formBody={body}
            setFormBody={setBody}
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
              src={`${base_url}/api/tmp/${user_id}/340/${afterTmpImageUpload}`}
              alt="tmp file upload"
            />
          ) : null}
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

const EditImageComponent = (props: EditImageComponentProps) => {
  const { uploadImage, changeFile, imageEdit, setCropImageMetadata } = props
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspectRatio, setAspectRatio] = useState({
    width: 4,
    height: 3,
  })

  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
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
