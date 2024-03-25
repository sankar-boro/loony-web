import { useEffect, useState } from 'react';
import { ModalMd, ModalBodyContainer } from '../components';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import { updateBlogNode, orderBlogNodes } from 'loony-utils';

const EditNode = ({ activeNode, rawNodes, setRawNodes, setBlogNodes, setActivity }) => {
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
      uid: activeNode.uid,
    };
    axiosInstance
      .post('/blog/edit_blog_node', submitData)
      .then(({ data }) => {
        const updatedNodes = updateBlogNode(rawNodes, submitData);
        setRawNodes(rawNodes);
        setBlogNodes(orderBlogNodes(updatedNodes));
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

export default EditNode;
