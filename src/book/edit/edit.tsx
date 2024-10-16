import { deleteOne } from "loony-utils";
import { axiosInstance } from "loony-query";
import AddNode from "../../form/addNode.tsx";
import EditDocument from "../../form/editNode.tsx";
import ConfirmAction from "../../components/ConfirmAction.tsx";
import { appendChapters, appendSections, appendSubSections } from "loony-utils";
import { AppDispatchAction, BookEditAction, BookEditState } from "types/index.ts";
import { NavigateFunction } from "react-router-dom";

export default function EditComponent({
  state,
  setState,
  setAppContext,
  book_id,
  navigate,
  isMobile,
}: {
  state: BookEditState,
  setState: BookEditAction,
  setAppContext: AppDispatchAction,
  book_id: string,
  navigate: NavigateFunction,
  isMobile: boolean,
}) {
  const {
    deleteNode,
    editNode,
    nodes101,
    frontPage,
    modal,
    page_id,
    section_id,
    activeSectionsByPageId,
    activeSubSectionsBySectionId,
    allSectionsByPageId,
    allSubSectionsBySectionId,
    topNode,
  } = state;
  const onDeleteNode = () => {
    if (!deleteNode) return;
    const submitData = {
      identity: deleteNode.identity,
      parent_id: deleteNode.parent_id,
      delete_id: deleteNode.uid,
    };
    axiosInstance
      .post(`/book/delete/node`, submitData)
      .then((res) => {
        if (deleteNode.identity === 101) {
          const __nodes101 = deleteOne(nodes101, res.data);
          setState({
            ...state,
            activeNode: frontPage,
            nodes101: __nodes101,
            deleteNode: null,
            modal: "",
          });
        }
        if (deleteNode.identity === 102) {
          const __activeSectionsByPageId = deleteOne(
            activeSectionsByPageId,
            res.data
          );
          let __activeNode = null;
          nodes101.forEach((x) => {
            if (x.uid === page_id) {
              __activeNode = x;
            }
          });
          setState({
            ...state,
            activeNode: __activeNode,
            activeSectionsByPageId: __activeSectionsByPageId,
            allSectionsByPageId: {
              ...allSectionsByPageId,
              [page_id as number]: __activeSectionsByPageId,
            },
            deleteNode: null,
            modal: "",
          });
        }
        if (deleteNode.identity === 103) {
          const __activeSubSectionsBySectionId = deleteOne(
            activeSubSectionsBySectionId,
            res.data
          );
          setState({
            ...state,
            activeSubSectionsBySectionId: __activeSubSectionsBySectionId,
            allSubSectionsBySectionId: {
              ...allSubSectionsBySectionId,
              [section_id as number]: __activeSubSectionsBySectionId,
            },
            modal: "",
            deleteNode: null,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteBook = () => {
    axiosInstance
      .post("/book/delete", { book_id: parseInt(book_id) })
      .then(() => {
        setAppContext((prevState) => ({
          ...prevState,
          alert: {
            status: "success",
            title: "Deleted Book",
            body: "Your book has been successfully deleted."
          },
        }));
        navigate("/", { replace: true });
      });
  };

  const editPage = (data: any) => {
    let __activeNode = null;
    const __nodes101 = nodes101.map((n) => {
      if (n.uid === editNode.uid) {
        const t = {
          ...n,
          ...data,
        };
        __activeNode = t;
        return t;
      }
      return n;
    });
    setState({
      ...state,
      activeNode: __activeNode,
      nodes101: __nodes101,
      modal: "",
    });
  };
  const editSection = (data: any) => {
    let __activeSection = null;
    const __activeSectionsByPageId = activeSectionsByPageId.map((innerNode) => {
      if (innerNode.uid === editNode.uid) {
        __activeSection = {
          ...innerNode,
          ...data.data,
        };
      }
      return innerNode;
    });
    setState({
      ...state,
      activeSectionsByPageId: __activeSectionsByPageId,
      allSectionsByPageId: {
        ...allSectionsByPageId,
        [page_id as number]: __activeSectionsByPageId,
      },
      activeNode: __activeSection,
      modal: "",
      editNode: null,
    });
  };
  const editSubSection = ({ data }: any) => {
    const __activeSubSectionsBySectionId = activeSubSectionsBySectionId.map(
      (innerNode) => {
        if (innerNode.uid === editNode.uid) {
          return {
            ...innerNode,
            ...data,
          };
        }
        return innerNode;
      }
    );
    setState({
      ...state,
      activeSubSectionsBySectionId: __activeSubSectionsBySectionId,
      allSubSectionsBySectionId: {
        ...allSubSectionsBySectionId,
        [section_id as number]: __activeSubSectionsBySectionId,
      },
      modal: "",
    });
  };

  const updateFrontPage = (data: any) => {
    const __activeNode = {
      ...frontPage,
      ...data,
    };
    setState({
      ...state,
      activeNode: __activeNode,
      page_id: __activeNode.uid,
      modal: "",
    });
  };

  const editFnCallback = (data: any) => {
    if (editNode.identity === 100) {
      updateFrontPage(data);
    }
    if (editNode.identity === 101) {
      editPage(data);
    }
    if (editNode.identity === 102) {
      editSection(data);
    }
    if (editNode.identity === 103) {
      editSubSection(data);
    }
  };

  const addChapterFnCb = (data: any) => {
    const __nodes101 = appendChapters(nodes101, topNode, data);
    setState({
      ...state,
      activeNode: data.new_node,
      nodes101: __nodes101,
      modal: "",
    });
  };

  const addSectionFnCb = (data: any) => {
    const __activeSectionsByPageId = appendSections(
      activeSectionsByPageId,
      topNode,
      data
    );
    const newActiveNode = data.new_node;
    setState({
      ...state,
      section_id: newActiveNode.uid,
      activeNode: newActiveNode,
      activeSectionsByPageId: __activeSectionsByPageId,
      allSectionsByPageId: {
        ...allSectionsByPageId,
        [page_id as number]: __activeSectionsByPageId,
      },
      modal: "",
    });
  };

  const addSubSectionFnCb = (data: any) => {
    const __activeSubSectionsBySectionId = appendSubSections(
      activeSubSectionsBySectionId,
      topNode,
      data
    );

    setState({
      ...state,
      allSubSectionsBySectionId: {
        ...allSubSectionsBySectionId,
        [section_id as number]: __activeSubSectionsBySectionId,
      },
      activeSubSectionsBySectionId: __activeSubSectionsBySectionId,
      modal: "",
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      modal: "",
      editNode: null,
      addNode: null,
    });
  };
  return (
    <>
      {modal && modal === "add_chapter" ? (
        <AddNode
          state={state}
          FnCallback={addChapterFnCb}
          url="/book/append/node"
          isMobile={isMobile}
          docIdName="book_id"
          docId={book_id}
          parent_id={topNode.uid}
          identity={101}
          parent_identity={topNode.identity}
          page_id={page_id as number}
          onCancel={onCancel}
          heading="Add Chapter"
        />
      ) : null}

      {modal && modal === "add_section" ? (
        <AddNode
          state={state}
          FnCallback={addSectionFnCb}
          url="/book/append/node"
          isMobile={isMobile}
          docIdName="book_id"
          docId={book_id}
          parent_id={topNode.uid}
          parent_identity={topNode.identity}
          identity={102}
          page_id={page_id as number}
          onCancel={onCancel}
          heading="Add Section"
        />
      ) : null}

      {modal && modal === "add_sub_section" ? (
        <AddNode
          state={state}
          FnCallback={addSubSectionFnCb}
          url="/book/append/node"
          isMobile={isMobile}
          docIdName="book_id"
          docId={book_id}
          parent_id={topNode.uid}
          parent_identity={topNode.identity}
          identity={103}
          page_id={section_id as number}
          onCancel={onCancel}
          heading="Add Sub Section"
        />
      ) : null}

      {modal && modal === "edit_node" ? (
        <EditDocument
          docIdName="book_id"
          doc_id={book_id}
          state={state}
          FnCallback={editFnCallback}
          onCancel={onCancel}
          heading="Edit Node"
          url="/book/edit/node"
          isMobile={isMobile}
        />
      ) : null}

      {modal && modal === "delete_book" ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Book?"
          confirmAction={deleteBook}
          title="Delete Book"
          onCancel={onCancel}
        />
      ) : null}

      {modal && modal === "delete_page" ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Page?"
          confirmAction={onDeleteNode}
          title="Delete Page"
          onCancel={onCancel}
        />
      ) : null}

      {modal && modal === "delete_node" ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Node?"
          confirmAction={onDeleteNode}
          title="Delete Node"
          onCancel={onCancel}
        />
      ) : null}
    </>
  );
}
