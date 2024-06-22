import { useEffect, useState, useContext } from 'react';
import { ModalMd, ModalBodyContainer, ModalButtonContainer } from '../components';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { axiosInstance } from 'loony-query';
import Cropper from 'react-easy-crop';
import { AuthContext } from '../context/AuthContext';

const getUrl = (editNode) => {
  if (editNode.identity === 100) {
    return '/book/edit_book';
  }
  return '/book/edit_book_node';
};
const EditNode = ({ state, docIdName, doc_id, FnCallback, onCancel }) => {
  const { editNode } = state;
  const url = getUrl(editNode);
  const { auth } = useContext(AuthContext);
  const { user_id } = auth.user;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [afterImageSelect, setAfterImageSelect] = useState({
    image: null,
    width: null,
    height: null,
    hasImage: false,
  });

  const [afterTmpImageUpload, setAfterTmpImageUpload] = useState('');
  const [imageEdit, setImageEdit] = useState(null);
  const [cropImageMetadata, setCropImageMetadata] = useState({
    width: null,
    height: null,
    x: null,
    y: null,
  });

  useEffect(() => {
    if (editNode) {
      setTitle(editNode.title);
      setBody(editNode.body);
      setBody(editNode.body);
      let __image = JSON.parse(editNode.images);
      if (__image.length > 0) {
        setImage(__image[0].name);
      }
    }
  }, [editNode]);

  const addNode = (e) => {
    e.preventDefault();
    const submitData = {
      title,
      body,
      uid: editNode.uid,
      [docIdName]: doc_id,
      identity: editNode.identity,
      images: [{ name: afterTmpImageUpload ? afterTmpImageUpload : image }],
    };
    axiosInstance
      .post(url, submitData)
      .then((res) => {
        FnCallback(res.data);
      })
      .catch(() => {
        onCloseModal();
      });
  };
  const onCloseModal = () => {
    setTitle('');
    setBody('');
    onCancel();
  };
  const onSelectImage = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = function () {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        if (width > height && width <= 1420) {
          return;
        }
        if (height > width && height <= 1420) {
          return;
        }
        setAfterImageSelect({
          hasImage: true,
          image: selectedFile,
          width,
          height,
        });
        setImageEdit(URL.createObjectURL(selectedFile));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const changeFile = onSelectImage;

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append(
      'metadata',
      JSON.stringify({
        oriImgMd: afterImageSelect,
        cropImgMd: cropImageMetadata,
      }),
    );
    formData.append('file', afterImageSelect.image);

    const { data } = await axiosInstance.post('/upload_file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setAfterTmpImageUpload(data.name);
    setImageEdit('');
    return data;
  };

  const imageName = docIdName === 'book_id' ? 'book' : 'blog';

  return (
    <ModalMd visible={true} onClose={onCloseModal} title='Update Node'>
      <ModalBodyContainer>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ width: '45%' }}>
            {image ? (
              <img
                src={`${process.env.REACT_APP_BASE_API_URL}/api/${imageName}/${user_id}/340/${image}`}
                alt='tmp file upload'
              />
            ) : null}
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
            {!afterTmpImageUpload && imageEdit ? (
              <EditImageComponent
                uploadImage={uploadImage}
                changeFile={changeFile}
                imageEdit={imageEdit}
                setCropImageMetadata={setCropImageMetadata}
              />
            ) : null}
            {!afterTmpImageUpload && !imageEdit ? (
              <SelectImage onSelectImage={onSelectImage} />
            ) : null}
            {afterTmpImageUpload && !imageEdit ? (
              <img
                src={`${process.env.REACT_APP_BASE_API_URL}/api/tmp/${user_id}/340/${afterTmpImageUpload}`}
                alt='tmp file upload'
              />
            ) : null}
          </div>
          <div style={{ width: '50%' }}>
            <MarkdownPreview source={body} wrapperElement={{ 'data-color-mode': 'light' }} />
          </div>
        </div>
      </ModalBodyContainer>
      <ModalButtonContainer>
        <button onClick={onCloseModal} className='grey-bg'>
          Cancel
        </button>
        <button onClick={addNode} className='black-bg' style={{ marginLeft: 15 }}>
          Update
        </button>
      </ModalButtonContainer>
    </ModalMd>
  );
};

export default EditNode;

const EditImageComponent = ({ uploadImage, changeFile, imageEdit, setCropImageMetadata }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState({
    width: 4,
    height: 3,
  });

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCropImageMetadata(croppedAreaPixels);
  };

  return (
    <div className='form-section'>
      <label>Image</label>
      <div
        style={{
          border: '1px dashed #ccc',
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', width: '100%', minHeight: 350 }}>
            <Cropper
              image={imageEdit}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio.width / aspectRatio.height}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <label>Choose another file</label>
          <br />
          <div className='flex-row'>
            <button
              onClick={() => {
                setAspectRatio({ width: 4, height: 3 });
              }}
            >
              4/3
            </button>
            <button
              onClick={() => {
                setAspectRatio({ width: 9, height: 16 });
              }}
            >
              9/16
            </button>
          </div>
          <input
            type='file'
            onChange={changeFile}
            style={{
              backgroundColor: 'white',
              border: 'none',
              padding: 0,
              margin: 0,
              marginTop: 20,
              borderRadius: 15,
              width: '50%',
            }}
          />
          <button onClick={uploadImage}>Upload</button>
        </div>
      </div>
    </div>
  );
};

const SelectImage = ({ onSelectImage }) => {
  return (
    <div className='form-section'>
      <label>Image</label>
      <div
        style={{
          border: '1px dashed #ccc',
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <label>Drop file here</label>
          <br />
          <span>or</span>
          <input
            type='file'
            onChange={onSelectImage}
            style={{
              backgroundColor: 'white',
              border: 'none',
              padding: 0,
              margin: 0,
              marginTop: 20,
              borderRadius: 15,
              width: '50%',
            }}
          />
        </div>
      </div>
    </div>
  );
};
