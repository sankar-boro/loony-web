/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { axiosInstance } from '../utils/query';
import {} from 'react-router-dom';
import 'react-easy-crop/react-easy-crop.css';
import { AuthContext } from '../context/AuthContext';

export default function FormComponent({ editNode, url, title, isMobile }) {
  const navigate = useNavigate();
  const { setAuthContext } = useContext(AuthContext);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formImage, setFormImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      .post(url, { title: formTitle, body: formBody, images: [{ name: formImage }], author_id: 1 })
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
          {formImage ? (
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
                  <img
                    src={`${process.env.REACT_APP_BASE_API_URL}/api/u/${formImage}`}
                    alt=''
                    width='50%'
                  />
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
                    onChange={(e) => {
                      uploadFile(e.target.files[0]);
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
