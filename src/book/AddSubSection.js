import { useEffect, useState } from 'react';
import { ModalMd, ModalBodyContainer, ModalButtonContainer } from '../components';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import { appendBookNode, orderBookNodes } from 'loony-utils';

const AddSubSection = ({
  activeNode,
  book_id,
  rawNodes,
  setRawNodes,
  setBookNodes,
  page_id,
  setMainNode,
  setNavNodes,
  onClose,
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
    if (!title || !body) return;
    axiosInstance
      .post('/book/append_book_node', {
        title,
        body,
        book_id: parseInt(book_id, 10),
        parent_id: activeNode.uid,
        identity: 103,
        page_id: page_id || null,
        images: [{ name: uploadedImage }],
      })
      .then(({ data }) => {
        const newRawNodes = appendBookNode(rawNodes, activeNode, data);
        setRawNodes(newRawNodes);
        const orderedNodes = orderBookNodes(newRawNodes);
        const mainNode_ = orderedNodes && orderedNodes[0];
        const childNodes_ = orderedNodes.slice(1);
        setMainNode(mainNode_);
        setNavNodes(childNodes_);
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
    <ModalMd visible={visible} onClose={onCloseModal} title='Add Node'>
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

export default AddSubSection;
