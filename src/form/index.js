import { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { axiosInstance } from '../utils/query';
import 'react-easy-crop/react-easy-crop.css';
import { AuthContext } from '../context/AuthContext';
import Cropper from 'react-easy-crop';

export default function FormComponent({ editNode, url, title, isMobile }) {
  const navigate = useNavigate();
  const { setAuthContext } = useContext(AuthContext);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formImageTags, setFormImageTags] = useState('');
  const [afterImageSelect, setAfterImageSelect] = useState({
    image: null,
    width: null,
    height: null,
    hasImage: false,
  });
  const [afterTmpImageUpload, setAfterTmpImageUpload] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [imageEdit, setImageEdit] = useState(null);
  const [cropImageMetadata, setCropImageMetadata] = useState({
    width: null,
    height: null,
    x: null,
    y: null,
  });

  useEffect(() => {
    if (editNode) {
      setFormTitle(editNode.title);
      setFormBody(editNode.title);
      const images = editNode.images ? JSON.parse(editNode.images) : [];
      setAfterTmpImageUpload(images);
    }
  }, []);

  const createDoc = useCallback(() => {
    if (!formTitle || !formBody) return;
    setSubmitting(true);
    axiosInstance
      .post(url, {
        title: formTitle,
        body: formBody,
        images: [{ name: afterTmpImageUpload, tags: [formImageTags] }],
        author_id: 1,
      })
      .then(() => {
        setSubmitting(false);
        setAuthContext('alert', {
          alertType: 'success',
          title: 'Created',
          body: 'Created successfully',
        });
        navigate('/', { replace: true });
      })
      .catch(() => {
        setSubmitting(false);
      });
  }, [formTitle, formBody, afterTmpImageUpload]);

  const onSelectImage = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = function () {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        setAfterImageSelect({
          hasImage: true,
          image: selectedFile,
          width,
          height,
        });
        setImageEdit(URL.createObjectURL(selectedFile));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const changeFile = onSelectImage;

  const uploadImage = () => {
    const formData = new FormData();
    formData.append(
      'metadata',
      JSON.stringify({
        oriImgMd: afterImageSelect,
        cropImgMd: cropImageMetadata,
      }),
    );
    formData.append('file', afterImageSelect.image);

    axiosInstance
      .post('/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => {
        setAfterTmpImageUpload(data.name);
      })
      .catch((err) => {});
  };

  return (
    <div
      className='book-container'
      style={{ width: isMobile ? '90%' : '', paddingLeft: 'auto', paddingRight: 'auto' }}
    >
      <h2>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
          <div className='form-section'>
            <label>Title</label>
            <br />
            <input
              type='text'
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value);
              }}
            />
          </div>
          <div className='form-section'>
            <label>Body</label>
            <br />
            <textarea
              onChange={(e) => {
                setFormBody(e.target.value);
              }}
              rows={24}
              cols={100}
              value={formBody}
            />
          </div>
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
          <div className='form-section'>
            <label>Image Tags</label>
            <br />
            <input
              type='text'
              value={formImageTags}
              onChange={(e) => {
                setFormImageTags(e.target.value);
              }}
            />
          </div>
          <div>
            <button
              className='black-bg'
              onClick={createDoc}
              disabled={submitting}
              style={{ marginRight: 10 }}
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
            <button
              className='grey-bg'
              onClick={() => {
                navigate('/', { replace: true });
              }}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>
        {!isMobile ? (
          <div style={{ flex: 1, padding: 25 }}>
            <MarkdownPreview source={formBody} wrapperElement={{ 'data-color-mode': 'light' }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

const EditImageComponent = ({ uploadImage, changeFile, imageEdit, setCropImageMetadata }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCropImageMetadata(croppedAreaPixels);
  };

  return (
    <div className='form-section'>
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
              image={imageEdit}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <label>Choose another file</label>
          <br />
          <input
            type='file'
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
  );
};

const SelectImage = ({ onSelectImage }) => {
  return (
    <div className='form-section'>
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
            type='file'
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
  );
};
