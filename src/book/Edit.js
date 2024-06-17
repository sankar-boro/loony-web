import { useState, useEffect, useContext } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

import { orderBookNodes, deleteOne, extractImage, orderNodes } from 'loony-utils';
import { RxReader } from 'react-icons/rx';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdAdd } from 'react-icons/md';
import { LuFileWarning } from 'react-icons/lu';
import { FiEdit2 } from 'react-icons/fi';
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
  MdOutlineEdit,
} from 'react-icons/md';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { axiosInstance } from '../utils/query';
import AddNode from '../form/addNode';
import EditDocument from '../form/editDocument';
import ConfirmAction from '../components/ConfirmAction';
import { AuthContext } from '../context/AuthContext';
import PageLoader from '../components/PageLoader';
import { appendChapters, appendSections, appendSubSections } from 'loony-utils';

export default function Edit() {
  const { bookId } = useParams();
  const book_id = parseInt(bookId);
  const navigate = useNavigate();
  const { setContext } = useContext(AuthContext);

  const [state, setState] = useState({
    modal: '',
    deleteNode: null,
    editNode: null,
    activeNode: null,
    topNode: null,
    page_id: null,
    section_id: null,
    activeSectionsByPageId: [],
    allSectionsByPageId: {},
    activeSubSectionsBySectionId: [],
    allSubSectionsBySectionId: {},
    nodes101: [],
    frontPage: null,
  });

  const {
    activeNode,
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

  const getChapters = () => {
    axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
      const bookTree = orderBookNodes(data.data);
      const __frontPage = bookTree && bookTree[0];
      const __nodes101 = bookTree.slice(1);

      setState({
        ...state,
        frontPage: __frontPage,
        activeNode: __frontPage,
        nodes101: __nodes101,
        page_id: __frontPage.uid,
      });
    });
  };

  useEffect(() => {
    if (book_id) {
      getChapters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book_id]);

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
        [page_id]: __activeSubSectionsBySectionId,
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

  if (!activeNode) return null;
  if (!nodes101) return null;
  const image = extractImage(activeNode.images);

  if (!frontPage)
    return (
      <div className='book-container'>
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
          <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }} />
          <div
            style={{
              width: '100%',
              paddingTop: 15,
              paddingLeft: '5%',
              background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
              paddingBottom: 50,
            }}
          >
            <PageLoader key_id={1} />
          </div>
        </div>
      </div>
    );

  return (
    <div className='book-container'>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        <Navigation setState={setState} nodes101={nodes101} state={state} book_id={book_id} />

        {/* Page */}
        <div
          style={{
            width: '60%',
            paddingTop: 15,
            paddingLeft: '5%',
            paddingRight: '5%',
            background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
            height: '110vh',
          }}
        >
          <div>
            <div className='page-heading'>{activeNode.title}</div>
            {image && image.name ? (
              <div style={{ width: '100%', borderRadius: 5 }}>
                <img
                  src={`${process.env.REACT_APP_BASE_API_URL}/api/book/${book_id}/720/${image.name}`}
                  alt=''
                  width='100%'
                />
              </div>
            ) : null}
            <MarkdownPreview
              source={activeNode.body}
              wrapperElement={{ 'data-color-mode': 'light' }}
            />
          </div>
          {activeNode.identity >= 100 ? (
            <div className='flex-row' style={{ marginTop: 24 }}>
              {activeNode.identity === 102 ? (
                <div
                  className='button-none cursor'
                  onClick={(e) => {
                    setState({
                      ...state,
                      topNode: activeNode,
                      modal: 'add_sub_section',
                    });
                    e.stopPropagation();
                  }}
                  style={{ marginRight: 10 }}
                >
                  <div className='btn-action'>
                    <MdAdd size={16} color='#9c9c9c' />
                  </div>
                </div>
              ) : null}

              <div
                className='button-none cursor'
                onClick={(e) => {
                  setState({
                    ...state,
                    deleteNode: activeNode,
                    modal: 'delete_page',
                  });
                  e.stopPropagation();
                }}
                style={{ marginRight: 10 }}
              >
                <div className='btn-action'>
                  <AiOutlineDelete size={16} color='#9c9c9c' />
                </div>
              </div>

              <div
                className='button-none cursor'
                onClick={(e) => {
                  setState({
                    ...state,
                    editNode: activeNode,
                    modal: 'edit_node',
                  });
                  e.stopPropagation();
                }}
              >
                <div className='btn-action'>
                  <MdOutlineEdit size={16} color='#9c9c9c' />
                </div>
              </div>
            </div>
          ) : null}

          <div
            style={{
              marginTop: 16,
            }}
          >
            {activeSubSectionsBySectionId.map((subSectionNode) => {
              const subSectionNodeImage = extractImage(subSectionNode.images);

              return (
                <div style={{ marginBottom: 25, marginTop: 25 }} key={subSectionNode.uid}>
                  <div className='section-title'>{subSectionNode.title}</div>
                  {subSectionNodeImage && subSectionNodeImage.name ? (
                    <div style={{ width: '100%', borderRadius: 5 }}>
                      <img
                        src={`${process.env.REACT_APP_BASE_API_URL}/api/book/${book_id}/720/${subSectionNodeImage.name}`}
                        alt=''
                        width='100%'
                      />
                    </div>
                  ) : null}
                  <MarkdownPreview
                    source={subSectionNode.body}
                    wrapperElement={{ 'data-color-mode': 'light' }}
                  />
                  <div className='flex-row' style={{ marginTop: 20 }}>
                    <div
                      className='button-none cursor'
                      onClick={(e) => {
                        setState({
                          ...state,
                          topNode: subSectionNode,
                          modal: 'add_sub_section',
                        });
                        e.stopPropagation();
                      }}
                      style={{ marginRight: 16 }}
                    >
                      <div className='btn-action'>
                        <MdAdd size={16} color='#9c9c9c' />
                      </div>
                    </div>
                    <div
                      className='button-none cursor'
                      onClick={(e) => {
                        setState({
                          ...state,
                          editNode: subSectionNode,
                          modal: 'edit_node',
                        });
                        e.stopPropagation();
                      }}
                      style={{ marginRight: 16 }}
                    >
                      <div className='btn-action'>
                        <FiEdit2 size={16} color='#9c9c9c' />
                      </div>
                    </div>
                    <div
                      className='delete-button-none cursor'
                      onClick={(e) => {
                        setState({
                          ...state,
                          deleteNode: subSectionNode,
                          modal: 'delete_node',
                        });
                        e.stopPropagation();
                      }}
                    >
                      <div className='btn-action'>
                        <AiOutlineDelete size={16} color='#9c9c9c' />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/*
         * @Page End
         */}

        <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
          <ul style={{ paddingLeft: 0, listStyle: 'none' }} className='list-item'>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <RxReader size={16} color='#2d2d2d' />
              <Link to={`/view/book/${book_id}`} style={{ marginLeft: 5 }}>
                Read Book
              </Link>
            </li>
            <li
              onClick={() => {
                setState({
                  ...state,
                  modal: 'delete_book',
                });
              }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <AiOutlineDelete size={16} color='#2d2d2d' />
              <span style={{ marginLeft: 5 }}>Delete Book</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <LuFileWarning size={16} color='#2d2d2d' />
              <span style={{ marginLeft: 5 }}>Report</span>
            </li>
          </ul>
        </div>
      </div>

      {modal === 'add_chapter' ? (
        <AddNode
          state={state}
          setState={setState}
          FnCallback={addChapterFnCb}
          url='/book/append_book_node'
          isMobile={false}
          docIdName='book_id'
          docId={bookId}
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
          docId={bookId}
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
          docId={bookId}
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
    </div>
  );
}

const Navigation = ({ setState, nodes101, state, book_id }) => {
  const {
    page_id,
    activeSectionsByPageId,
    frontPage,
    allSectionsByPageId,
    allSubSectionsBySectionId,
  } = state;

  const getSections = (__node) => {
    const { uid } = __node;
    if (allSectionsByPageId[uid]) {
      setState({
        ...state,
        activeSectionsByPageId: allSectionsByPageId[uid],
        page_id: __node.uid,
        activeNode: __node,
        activeSubSectionsBySectionId: [],
      });
    } else {
      axiosInstance
        .get(`/book/get_book_sections?book_id=${book_id}&page_id=${uid}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, __node);
          setState({
            ...state,
            activeSectionsByPageId: res,
            allSectionsByPageId: {
              ...allSectionsByPageId,
              [uid]: res,
            },
            page_id: __node.uid,
            activeNode: __node,
            activeSubSectionsBySectionId: [],
          });
        });
    }
  };

  const getSubSections = (__node) => {
    const { uid } = __node;
    if (allSubSectionsBySectionId[uid]) {
      setState({
        ...state,
        activeSubSectionsBySectionId: allSubSectionsBySectionId[uid],
        section_id: __node.uid,
        activeNode: __node,
      });
    } else {
      axiosInstance
        .get(`/book/get_book_sub_sections?book_id=${book_id}&page_id=${uid}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, __node);
          setState({
            ...state,
            activeSubSectionsBySectionId: res,
            allSubSectionsBySectionId: {
              ...allSubSectionsBySectionId,
              [uid]: res,
            },
            section_id: __node.uid,
            activeNode: __node,
          });
        });
    }
  };

  return (
    <>
      {/*
       * @ Left Navigation
       */}
      <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
        <div className='chapter-nav cursor'>
          <div
            className='chapter-nav'
            onClick={(e) => {
              e.stopPropagation();
              setState({
                ...state,
                page_id: frontPage.uid,
                activeNode: frontPage,
              });
            }}
          >
            {frontPage.title}
          </div>
        </div>
        <div
          className='button-none'
          onClick={(e) => {
            e.stopPropagation();
            setState({
              ...state,
              topNode: frontPage,
              modal: 'add_chapter',
            });
          }}
          style={{ marginRight: 16, paddingTop: 7, paddingBottom: 7 }}
        >
          Add Chapter
        </div>
        {nodes101.map((chapter) => {
          return (
            <div key={chapter.uid}>
              <div className='chapter-nav-con cursor' key={chapter.uid}>
                <div
                  className='chapter-nav'
                  onClick={(e) => {
                    e.stopPropagation();
                    getSections(chapter);
                  }}
                >
                  <div style={{ width: '90%' }}>{chapter.title}</div>
                  <div>
                    {page_id === chapter.uid ? (
                      <MdOutlineKeyboardArrowDown size={16} color='#2d2d2d' />
                    ) : (
                      <MdOutlineKeyboardArrowRight size={16} color='#2d2d2d' />
                    )}
                  </div>
                </div>
                <div className='flex-row' style={{ paddingTop: 5, paddingBottom: 5 }}>
                  <div
                    className='button-none'
                    onClick={() => {
                      setState({
                        ...state,
                        topNode: chapter,
                        modal: 'add_chapter',
                      });
                    }}
                    style={{ marginRight: 16 }}
                  >
                    Add Chapter
                  </div>
                </div>
              </div>
              {/* Sections */}
              <div style={{ paddingLeft: 20 }}>
                {page_id === chapter.uid && (
                  <>
                    <div
                      className='button-none'
                      onClick={() => {
                        setState({
                          ...state,
                          topNode: chapter,
                          modal: 'add_section',
                        });
                      }}
                      style={{ paddingBottom: 5 }}
                    >
                      Add Section
                    </div>
                    {activeSectionsByPageId.map((section) => {
                      return (
                        <div key={section.uid} className='section-nav cursor'>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              getSubSections(section);
                            }}
                          >
                            {section.title}
                          </div>
                          <div
                            className='button-none'
                            style={{ paddingTop: 5, paddingBottom: 5 }}
                            onClick={(e) => {
                              setState({
                                ...state,
                                topNode: section,
                                modal: 'add_section',
                              });
                              e.stopPropagation();
                            }}
                          >
                            Add Section
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/*
       * @ Left Navigation End
       */}
    </>
  );
};
