import { orderNodes, orderBookNodes } from "loony-utils";
import { axiosInstance } from "loony-query";

const resetState = {
  editNode: null,
  addNode: null,
  modal: "",
};

export const getSections = (
  __node,
  setState,
  setStatus,
  allSectionsByPageId,
  book_id
) => {
  const { uid } = __node;
  const url = `/book/get/sections?book_id=${book_id}&page_id=${uid}`;
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
  book_id
) => {
  const { uid } = __node;
  const url = `/book/get/sub_sections?book_id=${book_id}&page_id=${uid}`;
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
