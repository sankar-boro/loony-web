/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from 'loony-query';
import { AuthContext } from '../context/AuthContext';
import Cropper from 'react-easy-crop';
import { TextArea } from './components/TextArea';
import { MenuNavContainer } from '../components/Containers';
import { GoHome } from 'react-icons/go';
import { PiBookLight, PiNoteThin } from 'react-icons/pi';

import 'react-easy-crop/react-easy-crop.css';

export default function CreateNewDocument({ editNode, url, title, isMobile }) {
  const navigate = useNavigate();
  const { setContext, auth } = useContext(AuthContext);
  const { user_id } = auth.user;
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [theme, setTheme] = useState(11);

  const [afterImageSelect, setAfterImageSelect] = useState({
    image: null,
    width: null,
    height: null,
    hasImage: false,
  });
  const [afterTmpImageUpload, setAfterTmpImageUpload] = useState('');
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

  const createDoc = useCallback(async () => {
    let imageData = null;
    if (afterImageSelect.image) {
      imageData = await uploadImage();
    }
    if (!formTitle || !formBody) return;
    setSubmitting(true);
    axiosInstance
      .post(url, {
        title: formTitle,
        body: formBody,
        images: [{ name: imageData ? imageData.name : afterTmpImageUpload }],
        tags,
        theme,
      })
      .then(() => {
        setSubmitting(false);
        setContext({
          alert: {
            alertType: 'success',
            title: 'Created',
            body: 'Created successfully',
          },
        });
        navigate('/', { replace: true });
      })
      .catch(() => {
        setSubmitting(false);
      });
  }, [formTitle, formBody, afterTmpImageUpload, theme]);

  const onSelectImage = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = function () {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        if (width > height && width <= 1420) {
          return;
        }
        if (height > width && height <= 1420) {
          return;
        }
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

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append(
      'metadata',
      JSON.stringify({
        oriImgMd: afterImageSelect,
        cropImgMd: cropImageMetadata,
      }),
    );
    formData.append('file', afterImageSelect.image);

    const { data } = await axiosInstance.post('/upload_file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setAfterTmpImageUpload(data.name);
    setImageEdit('');
    return data;
  };

  return (
    <div className='form-container flex-row'>
      <div style={{ width: '20%', borderRight: '1px solid #ccc', paddingBottom: 100 }}>
        <MenuNavContainer activeMenu={'active-menu'}>
          <GoHome /> <span style={{ marginLeft: 10 }}>Create</span>
        </MenuNavContainer>
        <MenuNavContainer>
          <GoHome /> <span style={{ marginLeft: 10 }}>Home</span>
        </MenuNavContainer>
        <MenuNavContainer>
          <PiBookLight /> <span style={{ marginLeft: 10 }}>Books</span>
        </MenuNavContainer>
        <MenuNavContainer>
          <PiNoteThin /> <span style={{ marginLeft: 10 }}>Blogs</span>
        </MenuNavContainer>
      </div>
      <div style={{ width: '65%', paddingBottom: 100 }}>
        <div style={{ fontSize: 24, fontWeight: 'bold', padding: 45 }}>{title}</div>
        <div style={{ padding: '0px 45px 15px 45px' }}>
          <div style={{ padding: '0px 10px' }}>
            <div className='form-section'>
              <input
                type='text'
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                }}
                placeholder='Title'
              />
            </div>
            <TextArea
              formBody={formBody}
              setFormBody={setFormBody}
              theme={theme}
              setTheme={setTheme}
              isMobile={isMobile}
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
                src={`${process.env.REACT_APP_BASE_API_URL}/api/tmp/${user_id}/340/${afterTmpImageUpload}`}
                alt='tmp file upload'
              />
            ) : null}
            <div className='form-section'>
              <label>Tags</label>
              <br />
              <input
                type='text'
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                }}
              />
            </div>
          </div>
          <div className='flex-row' style={{ justifyContent: 'flex-end' }}>
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
      </div>
    </div>
  );
}

const EditImageComponent = ({ uploadImage, changeFile, imageEdit, setCropImageMetadata }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState({
    width: 4,
    height: 3,
  });

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
              aspect={aspectRatio.width / aspectRatio.height}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <label>Choose another file</label>
          <br />
          <div className='flex-row'>
            <button
              onClick={() => {
                setAspectRatio({ width: 4, height: 3 });
              }}
            >
              4/3
            </button>
            <button
              onClick={() => {
                setAspectRatio({ width: 9, height: 16 });
              }}
            >
              9/16
            </button>
          </div>
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
