import { orderNodes, orderBookNodes } from "loony-utils";
import { axiosInstance } from "loony-query";

export const getSections = (__node, setState, allSectionsByPageId, book_id) => {
  const { uid } = __node;
  if (allSectionsByPageId[uid]) {
    setState((prevState) => ({
      ...prevState,
      activeSectionsByPageId: allSectionsByPageId[uid],
      page_id: __node.uid,
      activeNode: __node,
      activeSubSectionsBySectionId: [],
      editNode: null,
      addNode: null,
      modal: "",
    }));
  } else {
    axiosInstance
      .get(`/book/get/sections?book_id=${book_id}&page_id=${uid}`)
      .then(({ data }) => {
        const res = orderNodes(data.data, __node);
        setState((prevState) => ({
          ...prevState,
          activeSectionsByPageId: res,
          allSectionsByPageId: {
            ...allSectionsByPageId,
            [uid]: res,
          },
          page_id: __node.uid,
          activeNode: __node,
          activeSubSectionsBySectionId: [],
          editNode: null,
          addNode: null,
          modal: "",
        }));
      });
  }
};

export const getSubSections = (
  __node,
  setState,
  allSubSectionsBySectionId,
  book_id
) => {
  const { uid } = __node;
  if (allSubSectionsBySectionId[uid]) {
    setState((prevState) => ({
      ...prevState,
      activeSubSectionsBySectionId: allSubSectionsBySectionId[uid],
      section_id: __node.uid,
      activeNode: __node,
      editNode: null,
      addNode: null,
      modal: "",
    }));
  } else {
    axiosInstance
      .get(`/book/get/sub_sections?book_id=${book_id}&page_id=${uid}`)
      .then(({ data }) => {
        const res = orderNodes(data.data, __node);
        setState((prevState) => ({
          ...prevState,
          activeSubSectionsBySectionId: res,
          allSubSectionsBySectionId: {
            ...allSubSectionsBySectionId,
            [uid]: res,
          },
          section_id: __node.uid,
          activeNode: __node,
          editNode: null,
          addNode: null,
          modal: "",
        }));
      });
  }
};
