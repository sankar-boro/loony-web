import { useEffect, useState } from 'react';
import { ModalMd, ModalBodyContainer, ModalButtonContainer } from '../components';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import { updateBookNode, orderBookNodes } from 'loony-utils';

const EditNode = ({
  activeNode,
  rawNodes,
  setRawNodes,
  setBookNodes,
  setMainNode,
  setChildNodes,
  onClose,
  book_id,
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
      uid: activeNode.uid,
      book_id,
      identity: activeNode.identity,
    };
    axiosInstance
      .post('/book/edit_book_node', submitData)
      .then(() => {
        const newRawNodes = updateBookNode(rawNodes, submitData);
        setRawNodes(newRawNodes);
        const orderedNodes = orderBookNodes(newRawNodes);
        const mainNode_ = orderedNodes && orderedNodes[0];
        const childNodes_ = mainNode_.child;
        setMainNode(mainNode_);
        setChildNodes(childNodes_);
        setBookNodes(orderedNodes);
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
    onClose();
  };
  return (
    <ModalMd visible={visible} onClose={onCloseModal} title='Add Sub Section'>
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
            <Markdown>{body}</Markdown>
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
