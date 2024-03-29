import { useState, useCallback } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';

export default function CreateBlog() {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [images] = useState('');

  const createDoc = useCallback(() => {
    const url = '/blog/create';
    axiosInstance
      .post(url, { title, body, images, password, author_id: 1 })
      .then(({ data }) => {})
      .catch((err) => {});
  }, [title, body, images, password]);

  return (
    <div className='con-75'>
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
          <div>
            <button onClick={createDoc}>Create</button>
          </div>
        </div>
        <div style={{ flex: 1, padding: 25 }}>
          <div>Markdown View</div>
          <Markdown>{body}</Markdown>
        </div>
      </div>
    </div>
  );
}
