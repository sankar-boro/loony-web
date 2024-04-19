import { useState, useCallback } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import { useHistory } from '../Router';

export default function CreateBlog() {
  const { replaceState } = useHistory();
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  // const [images, setImages] = useState([]);
  const [uploadedImage, setUploadedImage] = useState('');

  const createDoc = useCallback(() => {
    if (!title || !body) return null;
    const url = '/blog/create';
    axiosInstance
      .post(url, { title, body, images: [{ name: uploadedImage }], author_id: 1 })
      .then(({ data }) => {
        replaceState({}, null, '/');
      })
      .catch((err) => {});
  }, [title, body, uploadedImage]);

  const uploadFile = (selectedFile) => {
    // setCropImage(selectedFile);
    // const reader = new FileReader();
    // reader.readAsDataURL(selectedFile);
    // reader.addEventListener('load', () => {
    //   setCropImage(reader.result);
    // });
    const formData = new FormData();
    formData.append('file', selectedFile);
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

  const changeFile = uploadFile;

  return (
    <div className='book-container'>
      <h2>Create Blog</h2>
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
          {uploadedImage ? (
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
                <img src={`http://localhost:5002/api/u/${uploadedImage}`} alt='' width='50%' />;
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
            <button onClick={createDoc} className='black-bg'>
              Create
            </button>
          </div>
        </div>
        <div style={{ flex: 1, padding: 25 }}>
          <Markdown>{body}</Markdown>
        </div>
      </div>
    </div>
  );
}
