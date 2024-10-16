/* eslint-disable no-unused-vars */

import { useState, useCallback, useContext } from 'react'
import { axiosInstance } from 'loony-query'
import { AuthContext } from '../context/AuthContext.tsx'
import Cropper from 'react-easy-crop'
import { TextArea } from './components/TextArea.tsx'
import 'react-easy-crop/react-easy-crop.css'
import type {
  JsonObject,
  VoidReturnFunction,
  AuthContextProps,
  AppContextProps,
} from '../types/index.ts'
import AppContext from '../context/AppContext.tsx'

type ComponentProps = {
  heading: string
  state: JsonObject
  doc_idName: string
  doc_id: number
  parent_id: number
  identity: number
  page_id: number
  parent_identity: number
  FnCallback: (data: any) => void
  onCancel: VoidReturnFunction
  url: string
  isMobile: boolean
}

type EditImageComponentProps = {
  uploadImage: () => Promise<any>
  changeFile: React.ChangeEventHandler<HTMLInputElement>
  imageEdit: string | null
  setCropImageMetadata: React.Dispatch<React.SetStateAction<CropImageMetadata>>
}

type CropImageMetadata = {
  width: number | null
  height: number | null
  x: number | null
  y: number | null
}

type AfterImageSelect = {
  image: null | File
  width: null | number
  height: null | number
  hasImage: boolean
}

export default function AddNodeComponent(props: ComponentProps) {
  const {
    url,
    heading,
    doc_idName,
    doc_id,
    FnCallback,
    parent_id,
    identity,
    page_id,
    onCancel,
    parent_identity,
    isMobile,
  } = props

  const auth = useContext<AuthContextProps>(AuthContext)
  const { env } = useContext<AppContextProps>(AppContext)

  const user_id = auth.user?.uid
  const [formTitle, setFormTitle] = useState('')
  const [formBody, setFormBody] = useState('')
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

  const onCreateAction = useCallback(async () => {
    let imageData = null
    if (afterImageSelect.image) {
      imageData = await uploadImage()
    }
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
        images: [{ name: imageData ? imageData.name : afterTmpImageUpload }],
        tags: [],
        [doc_idName]: doc_id,
        parent_id,
        identity,
        page_id,
        theme,
        parent_identity,
      })
      .then((data) => {
        FnCallback(data.data)
      })
  }, [formTitle, formBody, afterTmpImageUpload])

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
              src={`${env.base_url}/api/tmp/${user_id}/340/${afterTmpImageUpload}`}
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
