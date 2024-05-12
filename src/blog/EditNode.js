import { useEffect, useState } from 'react';
import { ModalMd, ModalBodyContainer, ModalButtonContainer } from '../components';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { axiosInstance } from '../query';
import { updateBlogNode, orderBlogNodes } from 'loony-utils';

const EditNode = ({
  activeNode,
  rawNodes,
  setRawNodes,
  setBlogNodes,
  setChildNodes,
  setActivity,
  setMainNode,
  blog_id,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (activeNode) {
      setTitle(activeNode.title);
      setBody(activeNode.body);
      setVisible(true);
    }
  }, [activeNode]);
  const addNode = () => {
    const submitData = {
      title,
      body,
      blog_id,
      uid: activeNode.uid,
      identity: activeNode.parent_id ? 101 : 100,
    };
    axiosInstance
      .post('/blog/edit_blog_node', submitData)
      .then(({ data }) => {
        const newRawNodes = updateBlogNode(rawNodes, submitData);
        setRawNodes(newRawNodes);
        const blogs_ = orderBlogNodes(newRawNodes);
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
      modal: '',
    }));
  };
  return (
    <ModalMd visible={visible} onClose={onCloseModal} title='Update Node'>
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

export default EditNode;
