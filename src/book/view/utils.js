import { orderNodes, orderBookNodes } from "loony-utils";
import { axiosInstance } from "loony-query";

export const getSections = (
  __node,
  setState,
  setStatus,
  book_id,
  allSectionsByPageId
) => {
  const { uid } = __node;
  if (allSectionsByPageId[uid]) {
    setState((prevState) => ({
      ...prevState,
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
  book_id,
  allSubSectionsBySectionId
) => {
  const { uid } = __node;
  if (allSubSectionsBySectionId[uid]) {
    setState((prevState) => ({
      ...prevState,
      activeSubSectionsBySectionId: allSubSectionsBySectionId[uid],
      section_id: __node.uid,
      activeNode: __node,
    }));
  } else {
    setStatus((prevState) => ({
      ...prevState,
      status: "FETCHING",
    }));
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
        }));
        setStatus((prevState) => ({
          ...prevState,
          status: "",
        }));
      });
  }
};

export const getChapters = (book_id, setState, setStatus) => {
  axiosInstance.get(`/book/get/nodes?book_id=${book_id}`).then(({ data }) => {
    const bookTree = orderBookNodes(data.data);
    const __frontPage = bookTree && bookTree[0];
    const __nodes101 = bookTree.slice(1);
    setState((prevState) => ({
      ...prevState,
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
