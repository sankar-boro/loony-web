/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useContext } from "react";
import { axiosInstance } from "loony-query";
import "react-easy-crop/react-easy-crop.css";
import { AuthContext } from "../context/AuthContext";
import Cropper from "react-easy-crop";
import { Modal, ModalBodyContainer, ModalButtonContainer } from "../components";
import { TextArea } from "./components/TextArea";

export default function AddNodeComponent({
  url,
  heading,
  docIdName,
  docId,
  FnCallback,
  parent_id,
  identity,
  page_id,
  onCancel,
  parent_identity,
}) {
  const { auth } = useContext(AuthContext);
  const { user_id } = auth.user;
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [theme, setTheme] = useState(11);
  const [error, setError] = useState("");

  const [afterImageSelect, setAfterImageSelect] = useState({
    image: null,
    width: null,
    height: null,
    hasImage: false,
  });
  const [afterTmpImageUpload, setAfterTmpImageUpload] = useState("");
  const [imageEdit, setImageEdit] = useState(null);
  const [cropImageMetadata, setCropImageMetadata] = useState({
    width: null,
    height: null,
    x: null,
    y: null,
  });

  const onCreateAction = useCallback(async () => {
    let imageData = null;
    if (afterImageSelect.image) {
      imageData = await uploadImage();
    }
    if (!formTitle) {
      setError("Title is required.");
      return;
    }
    if (!formBody) {
      setError("Body is required.");
      return;
    }
    setSubmitting(true);
    axiosInstance
      .post(url, {
        title: formTitle,
        body: formBody,
        images: [{ name: imageData ? imageData.name : afterTmpImageUpload }],
        tags,
        [docIdName]: parseInt(docId),
        parent_id,
        identity,
        page_id,
        theme,
        parent_identity,
      })
      .then((data) => {
        setSubmitting(false);
        FnCallback(data.data);
      })
      .catch(() => {
        setSubmitting(false);
      });
  }, [formTitle, formBody, afterTmpImageUpload]);

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
      "metadata",
      JSON.stringify({
        oriImgMd: afterImageSelect,
        cropImgMd: cropImageMetadata,
      })
    );
    formData.append("file", afterImageSelect.image);

    const { data } = await axiosInstance.post("/upload_file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setAfterTmpImageUpload(data.name);
    setImageEdit("");
    return data;
  };

  return (
    <div
      style={{
        width: "60%",
        paddingLeft: "5%",
        background: "linear-gradient(to right, #ffffff, #F6F8FC)",
        minHeight: "100vh",
      }}
    >
      <div style={{}}>
        <h2>{heading}</h2>
        <div>
          {error ? (
            <div style={{ color: "#ff4949", fontWeight: "bold", fontSize: 14 }}>
              {error}
            </div>
          ) : null}
          <div className="form-section">
            <label>Title</label>
            <br />
            <input
              type="text"
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value);
              }}
            />
          </div>
          <TextArea
            formBody={formBody}
            setFormBody={setFormBody}
            theme={theme}
            setTheme={setTheme}
          />

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
              alt="tmp file upload"
            />
          ) : null}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onCancel}
          className="grey-bg"
          style={{ marginRight: 10 }}
        >
          Cancel
        </button>
        <button onClick={onCreateAction} className="black-bg">
          Submit
        </button>
      </div>
    </div>
  );
}

const EditImageComponent = ({
  uploadImage,
  changeFile,
  imageEdit,
  setCropImageMetadata,
}) => {
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
    <div className="form-section">
      <label>Image</label>
      <div
        style={{
          border: "1px dashed #ccc",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", width: "100%", minHeight: 350 }}>
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
          <div className="flex-row">
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
            type="file"
            onChange={changeFile}
            style={{
              backgroundColor: "white",
              border: "none",
              padding: 0,
              margin: 0,
              marginTop: 20,
              borderRadius: 15,
              width: "50%",
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
    <div className="form-section">
      <label>Image</label>
      <div
        style={{
          border: "1px dashed #ccc",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label>Drop file here</label>
          <br />
          <span>or</span>
          <input
            type="file"
            onChange={onSelectImage}
            style={{
              backgroundColor: "white",
              border: "none",
              padding: 0,
              margin: 0,
              marginTop: 20,
              borderRadius: 15,
              width: "50%",
            }}
          />
        </div>
      </div>
    </div>
  );
};
