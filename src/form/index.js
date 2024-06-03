/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { axiosInstance } from '../utils/query';
import {} from 'react-router-dom';
import 'react-easy-crop/react-easy-crop.css';
import { AuthContext } from '../context/AuthContext';
import Cropper from 'react-easy-crop';

export default function FormComponent({ editNode, url, title, isMobile }) {
  const navigate = useNavigate();
  const { setAuthContext } = useContext(AuthContext);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formImage, setFormImage] = useState({
    image: null,
    width: null,
    height: null,
    hasImage: false,
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropImage, setCropImage] = useState(null);
  const [cropImageMetadata, setCropImageMetadata] = useState({
    width: 1820,
    height: 1365,
    x: 114,
    y: 0,
  });

  useEffect(() => {
    if (editNode) {
      setFormTitle(editNode.title);
      setFormBody(editNode.title);
      const images = editNode.images ? JSON.parse(editNode.images) : [];
      const image = images.length > 0 ? images[0].name : '';
      setFormImage(image);
    }
  }, []);

  const createDoc = useCallback(() => {
    if (!formTitle || !formBody) return;
    setSubmitting(true);
    axiosInstance
      .post(url, {
        title: formTitle,
        body: formBody,
        images: [{ name: uploadedImage }],
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
  }, [formTitle, formBody, formImage]);

  const onSelectImage = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = function () {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        console.log(width, height);
        setFormImage({
          hasImage: true,
          image: selectedFile,
          width,
          height,
        });
        setCropImage(URL.createObjectURL(selectedFile));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const changeFile = onSelectImage;

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCropImageMetadata(croppedAreaPixels);
  };

  const uploadImage = () => {
    const formData = new FormData();
    formData.append(
      'metadata',
      JSON.stringify({
        oriImgMd: formImage,
        cropImgMd: cropImageMetadata,
      }),
    );
    formData.append('file', formImage.image);

    axiosInstance
      .post('/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => {
        setUploadedImage(data.data.uploaded_filename);
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
          {cropImage ? (
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
                      image={cropImage}
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
                    onChange={(e) => {
                      changeFile(e.target.files[0]);
                    }}
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
          ) : (
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
          )}
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
