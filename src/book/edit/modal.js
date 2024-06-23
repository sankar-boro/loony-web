import { deleteOne } from 'loony-utils';
import { axiosInstance } from 'loony-query';
import AddNode from '../../form/addNode';
import EditDocument from '../../form/editDocument';
import ConfirmAction from '../../components/ConfirmAction';
import { appendChapters, appendSections, appendSubSections } from 'loony-utils';

export const ModalComponent = ({ state, setState, setContext, book_id, navigate }) => {
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
    // [parent_id, delete_node, update_node]
    const submitData = {
      identity: deleteNode.identity,
      parent_id: deleteNode.parent_id,
      delete_id: deleteNode.uid,
    };
    axiosInstance
      .post(`/book/delete_book_node`, submitData)
      .then((res) => {
        if (deleteNode.identity === 101) {
          const __nodes101 = deleteOne(nodes101, res.data, submitData);
          setState({
            ...state,
            activeNode: frontPage,
            nodes101: __nodes101,
            deleteNode: null,
            modal: '',
          });
        }
        if (deleteNode.identity === 102) {
          const __activeSectionsByPageId = deleteOne(activeSectionsByPageId, res.data, submitData);
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
              [page_id]: __activeSectionsByPageId,
            },
            deleteNode: null,
            modal: '',
          });
        }
        if (deleteNode.identity === 103) {
          const __activeSubSectionsBySectionId = deleteOne(
            activeSubSectionsBySectionId,
            res.data,
            submitData,
          );
          setState({
            ...state,
            activeSubSectionsBySectionId: __activeSubSectionsBySectionId,
            allSubSectionsBySectionId: {
              ...allSubSectionsBySectionId,
              [section_id]: __activeSubSectionsBySectionId,
            },
            modal: '',
            deleteNode: null,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteBook = () => {
    axiosInstance.post('/book/delete_book', { book_id: parseInt(book_id) }).then(() => {
      setContext({
        alert: {
          alertType: 'success',
          title: 'Deleted Book',
          body: 'Your book has been successfully deleted.',
        },
      });
      navigate('/', { replace: true });
    });
  };

  const editPage = (data) => {
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
      modal: '',
    });
  };
  const editSection = (data) => {
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
        [page_id]: __activeSectionsByPageId,
      },
      activeNode: __activeSection,
      modal: '',
      editNode: null,
    });
  };
  const editSubSection = ({ data }) => {
    const __activeSubSectionsBySectionId = activeSubSectionsBySectionId.map((innerNode) => {
      if (innerNode.uid === editNode.uid) {
        return {
          ...innerNode,
          ...data,
        };
      }
      return innerNode;
    });
    setState({
      ...state,
      activeSubSectionsBySectionId: __activeSubSectionsBySectionId,
      allSubSectionsBySectionId: {
        ...allSubSectionsBySectionId,
        [section_id]: __activeSubSectionsBySectionId,
      },
      modal: '',
    });
  };

  const updateFrontPage = (data) => {
    const __activeNode = {
      ...frontPage,
      ...data,
    };
    setState({
      ...state,
      activeNode: __activeNode,
      page_id: __activeNode.uid,
      modal: '',
    });
  };

  const editFnCallback = (data) => {
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

  const addChapterFnCb = (data, err) => {
    const __nodes101 = appendChapters(nodes101, topNode, data);
    setState({
      ...state,
      activeNode: data.new_node,
      nodes101: __nodes101,
      modal: '',
    });
  };

  const addSectionFnCb = (data, err) => {
    const __activeSectionsByPageId = appendSections(activeSectionsByPageId, topNode, data);
    let newActiveNode = data.new_node;
    setState({
      ...state,
      section_id: newActiveNode.uid,
      activeNode: newActiveNode,
      activeSectionsByPageId: __activeSectionsByPageId,
      allSectionsByPageId: {
        ...allSectionsByPageId,
        [page_id]: __activeSectionsByPageId,
      },
      modal: '',
    });
  };

  const addSubSectionFnCb = (data, err) => {
    const __activeSubSectionsBySectionId = appendSubSections(
      activeSubSectionsBySectionId,
      topNode,
      data,
    );

    setState({
      ...state,
      allSubSectionsBySectionId: {
        ...allSubSectionsBySectionId,
        [section_id]: __activeSubSectionsBySectionId,
      },
      activeSubSectionsBySectionId: __activeSubSectionsBySectionId,
      modal: '',
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      modal: '',
    });
  };
  return (
    <>
      {modal === 'add_chapter' ? (
        <AddNode
          state={state}
          setState={setState}
          FnCallback={addChapterFnCb}
          url='/book/append_book_node'
          isMobile={false}
          docIdName='book_id'
          docId={book_id}
          parent_id={topNode.uid}
          identity={101}
          page_id={page_id}
          onCancel={onCancel}
        />
      ) : null}

      {modal === 'add_section' ? (
        <AddNode
          state={state}
          setState={setState}
          FnCallback={addSectionFnCb}
          url='/book/append_book_node'
          isMobile={false}
          docIdName='book_id'
          docId={book_id}
          parent_id={topNode.uid}
          identity={102}
          page_id={page_id}
          onCancel={onCancel}
        />
      ) : null}

      {modal === 'add_sub_section' ? (
        <AddNode
          state={state}
          setState={setState}
          FnCallback={addSubSectionFnCb}
          url='/book/append_book_node'
          isMobile={false}
          docIdName='book_id'
          docId={book_id}
          parent_id={topNode.uid}
          identity={103}
          page_id={section_id}
          onCancel={onCancel}
        />
      ) : null}

      {modal === 'edit_node' ? (
        <EditDocument
          docIdName='book_id'
          doc_id={book_id}
          state={state}
          setState={setState}
          FnCallback={editFnCallback}
          onCancel={onCancel}
        />
      ) : null}

      {modal === 'delete_book' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Book?'
          confirmAction={deleteBook}
          title='Delete Book'
          onCancel={onCancel}
        />
      ) : null}

      {modal === 'delete_page' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Page?'
          confirmAction={onDeleteNode}
          title='Delete Page'
          onCancel={onCancel}
        />
      ) : null}

      {modal === 'delete_node' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Node?'
          confirmAction={onDeleteNode}
          title='Delete Node'
          onCancel={onCancel}
        />
      ) : null}
    </>
  );
};
