import { useState } from 'react'
import { axiosInstance } from 'loony-api'
import Cropper, { Area } from 'react-easy-crop'
import type {
  AfterImageSelect,
  CropImageMetadata,
  EditImageComponentProps,
} from 'loony-types'

export default function UploadImage({
  baseUrl,
  user,
  setFormImages,
}: {
  baseUrl: string
  user: any
  setFormImages: any
}) {
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

    await axiosInstance
      .post('/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }: { data: { name: string } }) => {
        setAfterTmpImageUpload(data.name)
        setImageEdit('')
        setFormImages([data])
      })
  }

  return (
    <div>
      {!afterTmpImageUpload && imageEdit ? (
        <EditImageComponent
          uploadImage={uploadImage}
          onSelectImage={onSelectImage}
          imageEdit={imageEdit}
          setCropImageMetadata={setCropImageMetadata}
        />
      ) : null}
      {!afterTmpImageUpload && !imageEdit ? (
        <SelectImage onSelectImage={onSelectImage} />
      ) : null}
      {afterTmpImageUpload && !imageEdit ? (
        <img
          src={`${baseUrl}/api/tmp/${user?.uid}/340/${afterTmpImageUpload}`}
          alt="tmp file upload"
        />
      ) : null}
    </div>
  )
}

const EditImageComponent = (props: EditImageComponentProps) => {
  const { uploadImage, onSelectImage, imageEdit, setCropImageMetadata } = props
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspectRatio, setAspectRatio] = useState({
    width: 4,
    height: 3,
  })

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
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
