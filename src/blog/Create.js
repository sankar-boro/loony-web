import { useState, useCallback } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import { useHistory } from '../Router';

export default function CreateBlog() {
  const { replaceState } = useHistory();
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);

  const createDoc = useCallback(() => {
    const url = '/blog/create';
    axiosInstance
      .post(url, { title, body, images, author_id: 1 })
      .then(({ data }) => {
        replaceState({}, null, '/');
      })
      .catch((err) => {});
  }, [title, body, images]);

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
