import { orderNodes, orderDocumentNodes } from "loony-utils";
import { axiosInstance } from "loony-query";

const resetState = {
  editNode: null,
  addNode: null,
  modal: "",
};

export const getChapters = (document_id, setState, setStatus) => {
  axiosInstance
    .get(`/document/get/nodes?document_id=${document_id}`)
    .then(({ data }) => {
      const documentTree = orderDocumentNodes(data.chapters);
      const __frontPage = documentTree && documentTree[0];
      const __nodes101 = documentTree.slice(1);

      setState((prevState) => ({
        ...prevState,
        document_info: data.document,
        frontPage: __frontPage,
        activeNode: __frontPage,
        nodes101: __nodes101,
        page_id: __frontPage.uid,
      }));
      setStatus((prevStatus) => ({
        ...prevStatus,
        status: "",
      }));
    });
};

export const getSections = (
  __node,
  setState,
  setStatus,
  allSectionsByPageId,
  document_id
) => {
  const { uid } = __node;
  const url = `/document/get/sections?document_id=${document_id}&page_id=${uid}`;
  if (allSectionsByPageId[uid]) {
    setState((prevState) => ({
      ...prevState,
      ...resetState,
      activeSectionsByPageId: allSectionsByPageId[uid],
      page_id: __node.uid,
      activeNode: __node,
      activeSubSectionsBySectionId: [],
    }));
  } else {
    setStatus((prevState) => ({
      ...prevState,
      status: "FETCHING",
    }));
    axiosInstance.get(url).then(({ data }) => {
      const res = orderNodes(data.data, __node);
      setState((prevState) => ({
        ...prevState,
        ...resetState,
        activeSectionsByPageId: res,
        allSectionsByPageId: {
          ...allSectionsByPageId,
          [uid]: res,
        },
        page_id: __node.uid,
        activeNode: __node,
        activeSubSectionsBySectionId: [],
      }));
      setStatus((prevState) => ({
        ...prevState,
        status: "",
      }));
    });
  }
};

export const getSubSections = (
  __node,
  setState,
  setStatus,
  allSubSectionsBySectionId,
  document_id
) => {
  const { uid } = __node;
  const url = `/document/get/sub_sections?document_id=${document_id}&page_id=${uid}`;
  if (allSubSectionsBySectionId[uid]) {
    setState((prevState) => ({
      ...prevState,
      ...resetState,
      activeSubSectionsBySectionId: allSubSectionsBySectionId[uid],
      section_id: __node.uid,
      activeNode: __node,
    }));
  } else {
    setStatus((prevState) => ({
      ...prevState,
      status: "FETCHING",
    }));
    axiosInstance.get(url).then(({ data }) => {
      const res = orderNodes(data.data, __node);
      setState((prevState) => ({
        ...prevState,
        ...resetState,
        activeSubSectionsBySectionId: res,
        allSubSectionsBySectionId: {
          ...allSubSectionsBySectionId,
          [uid]: res,
        },
        section_id: __node.uid,
        activeNode: __node,
      }));
      setStatus((prevState) => ({
        ...prevState,
        status: "",
      }));
    });
  }
};
