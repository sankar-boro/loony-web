import { useEffect, useState } from 'react';
import { ModalMd, ModalBodyContainer } from '../components';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
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
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(false);
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
        images,
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
      modal: '',
    }));
  };
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
              <button onClick={addNode}>Create</button>
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <Markdown>{body}</Markdown>
          </div>
        </div>
      </ModalBodyContainer>
    </ModalMd>
  );
};

export default AddNode;
