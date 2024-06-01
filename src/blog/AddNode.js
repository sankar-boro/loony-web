import { useEffect, useState } from 'react';
import { ModalMd, ModalBodyContainer, ModalButtonContainer } from '../components';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { axiosInstance } from '../utils/query';
import { appendBlogNode, orderBlogNodes } from 'loony-utils';

const AddNode = ({
  activeNode,
  blog_id,
  rawNodes,
  setBlogNodes,
  setRawNodes,
  setMainNode,
  setChildNodes,
  setActivity,
  setModal,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [visible, setVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState('');

  useEffect(() => {
    if (activeNode) {
      setVisible(true);
    }
  }, [activeNode]);
  const addNode = () => {
    if (!title || !body) {
      return;
    }
    axiosInstance
      .post('/blog/append_blog_node', {
        title,
        body,
        blog_id: parseInt(blog_id, 10),
        parent_id: activeNode.uid,
        images: [{ name: uploadedImage }],
      })
      .then(({ data }) => {
        const newNodes = appendBlogNode(rawNodes, activeNode, data);
        setRawNodes(newNodes);
        const blogs_ = orderBlogNodes(newNodes);
        const mainNode_ = blogs_ && blogs_[0];
        const childNodes_ = blogs_.slice(1);

        if (mainNode_) {
          setMainNode(mainNode_);
          setChildNodes(childNodes_);
          setBlogNodes(blogs_);
        }
        onCloseModal();
      })
      .catch(() => {
        onCloseModal();
      });
  };
  const onCloseModal = () => {
    setTitle('');
    setBody('');
    setVisible(false);
    setActivity((prevState) => ({
      ...prevState,
      activeNode: null,
      page_id: null,
    }));
    setModal('');
  };
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
        setUploadedImage(data.data.uploaded_filename);
      })
      .catch((err) => {});
  };

  const changeFile = uploadFile;

  return (
    <ModalMd visible={visible} onClose={onCloseModal} title='Add Blog Node'>
      <ModalBodyContainer>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ width: '45%' }}>
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
                  <img
                    src={`${process.env.REACT_APP_BASE_API_URL}/api/u/${uploadedImage}`}
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
          </div>
          <div style={{ width: '50%' }}>
            <MarkdownPreview source={body} wrapperElement={{ 'data-color-mode': 'light' }} />
          </div>
        </div>
      </ModalBodyContainer>
      <ModalButtonContainer>
        <button onClick={addNode} className='black-bg'>
          Create
        </button>
      </ModalButtonContainer>
    </ModalMd>
  );
};

export default AddNode;
