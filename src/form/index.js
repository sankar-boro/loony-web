import { useState, useCallback, useEffect } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import {} from 'react-router-dom';
import 'react-easy-crop/react-easy-crop.css';

export default function FormComponent({ editNode, url, title }) {
  // const { replaceState } = useHistory();

  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formImage, setFormImage] = useState('');

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
    axiosInstance
      .post(url, { title: formTitle, body: formBody, images: [{ name: formImage }], author_id: 1 })
      .then(({ data }) => {
        // replaceState({}, null, '/');
      })
      .catch((err) => {});
  }, [formTitle, formBody, formImage]);

  const uploadFile = (selectedFile) => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    axiosInstance
      .post('/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => {
        setFormImage(data.data.uploaded_filename);
      })
      .catch((err) => {});
  };

  const changeFile = uploadFile;

  return (
    <div className='book-container'>
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
          {formImage ? (
            <div className='form-section'>
              <label>Image</label>
              <div
                style={{
                  display: 'flex',
                  border: '1px dashed #ccc',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: '15px 0px',
                }}
              >
                <img
                  src={`${process.env.REACT_APP_BASE_URL}/api/u/${formImage}`}
                  alt=''
                  width='50%'
                />
                <div style={{ marginTop: 24 }}>
                  <label>Choose another file</label>
                  <br />
                  <input
                    type='file'
                    title='Change file'
                    onChange={(e) => {
                      changeFile(e.target.files[0]);
                    }}
                    style={{ marginTop: 20 }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className='form-section'>
              <label>Image</label>
              <div
                style={{
                  display: 'flex',
                  border: '1px dashed #ccc',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: '15px 0px',
                }}
              >
                <label>Drop file here</label>
                <br />
                <span>or</span>
                <input
                  type='file'
                  onChange={(e) => {
                    uploadFile(e.target.files[0]);
                  }}
                  style={{ marginTop: 20 }}
                />
              </div>
            </div>
          )}
          <div>
            <button className='black-bg' onClick={createDoc}>
              Create
            </button>
          </div>
        </div>
        <div style={{ flex: 1, padding: 25 }}>
          <Markdown>{formBody}</Markdown>
        </div>
      </div>
    </div>
  );
}
