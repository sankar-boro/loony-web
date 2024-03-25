import { useEffect, useState } from 'react';
import { ModalMd, ModalBodyContainer } from '../components';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import { appendBookNode, orderBookNodes } from 'loony-utils';

const AddSubSection = ({
  activeNode,
  setActivity,
  book_id,
  rawNodes,
  setRawNodes,
  setBookNodes,
  page_id,
  setMainNode,
  setChildNodes,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (activeNode) {
      setVisible(true);
    }
  }, [activeNode]);
  const addNode = () => {
    axiosInstance
      .post('/book/append_book_node', {
        title,
        body,
        book_id: parseInt(book_id, 10),
        parent_id: activeNode.uid,
        identity: 103,
        page_id: page_id || null,
      })
      .then(({ data }) => {
        const newRawNodes = appendBookNode(rawNodes, activeNode, data);
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
    setActivity((prevState) => ({
      ...prevState,
      activeNode: null,
    }));
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

export default AddSubSection;
