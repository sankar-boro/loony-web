import { useState, useCallback } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import { useHistory } from '../Router';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';

export default function CreateBook() {
  const { replaceState } = useHistory();
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [images, setImages] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropImage, setCropImage] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
  };

  const createDoc = useCallback(() => {
    axiosInstance
      .post('/book/create', { title, body, images, password, author_id: 1 })
      .then(({ data }) => {
        replaceState({}, null, '/');
      })
      .catch((err) => {});
  }, [title, body, images, password]);

  const uploadFile = (selectedFile) => {
    setCropImage(selectedFile);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.addEventListener('load', () => {
      setCropImage(reader.result);
    });
    const formData = new FormData();
    formData.append('file', selectedFile);
    axiosInstance
      .post('/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => {
        setImages([
          ...images,
          {
            name: data.data.uploaded_filename,
          },
        ]);
      })
      .catch((err) => {});
  };

  return (
    <div className='book-container'>
      <h2>Create Book</h2>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
          <div className='form-section'>
            <label>Title</label>
            <br />
            <input
              type='text'
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className='form-section'>
            <label>Body</label>
            <br />
            <textarea
              onChange={(e) => {
                setBody(e.target.value);
              }}
              rows={24}
              cols={100}
              value={body}
            />
          </div>
          <div className='form-section'>
            <label>Body</label>
            <br />
            <input
              type='file'
              onChange={(e) => {
                uploadFile(e.target.files[0]);
              }}
            />
          </div>
          <div className='form-section'>
            <label>Password</label>
            <br />
            <input
              type='text'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          {cropImage && (
            <div style={{ position: 'relative', width: 250, height: 250 }}>
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
          )}
          <div>
            <button onClick={createDoc}>Create</button>
          </div>
        </div>
        <div style={{ flex: 1, padding: 25 }}>
          <Markdown>{body}</Markdown>
        </div>
      </div>
    </div>
  );
}
