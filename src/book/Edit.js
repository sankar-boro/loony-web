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
    activeNode: '',
    page_id: null,
    section_id: null,
  });

  const [frontPage, setFrontPage] = useState(null);
  const [nodes101, setNodes101] = useState([]);
  const [activeSectionsByPageId, setActiveSectionsByPageId] = useState([]);
  const [allSectionsByPageId, setAllSectionsByPageId] = useState({});
  const [activeSubSectionsBySectionId, setActiveSubSectionsBySectionId] = useState([]);
  const [allSubSectionsBySectionId, setAllSubSectionsBySectionId] = useState({});
  const { modal, activeNode, page_id, section_id } = state;
  const getChapters = () => {
    axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
      const bookTree = orderBookNodes(data.data);
      const thisFrontPage = bookTree && bookTree[0];
      const pages = bookTree.slice(1);

      setFrontPage(thisFrontPage);
      setNodes101(pages);
      setState({
        ...state,
        activeNode: thisFrontPage,
        page_id: thisFrontPage.uid,
      });
    });
  };

  const getSections = (node) => {
    const { uid } = node;
    if (allSectionsByPageId[uid]) {
      setActiveSectionsByPageId(allSectionsByPageId[uid]);
    } else {
      axiosInstance
        .get(`/book/get_book_sections?book_id=${book_id}&page_id=${uid}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, node);
          setActiveSectionsByPageId(res);
          setAllSectionsByPageId({
            ...allSectionsByPageId,
            [uid]: res,
          });
        });
    }
  };

  const getSubSections = (node) => {
    const { uid } = node;
    if (allSubSectionsBySectionId[uid]) {
      setActiveSubSectionsBySectionId(allSubSectionsBySectionId[uid]);
    } else {
      axiosInstance
        .get(`/book/get_book_sub_sections?book_id=${book_id}&page_id=${uid}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, node);
          setActiveSubSectionsBySectionId(res);
          setAllSubSectionsBySectionId({
            ...allSubSectionsBySectionId,
            [uid]: res,
          });
        });
    }
  };
  useEffect(() => {
    if (book_id) {
      getChapters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book_id]);

  const deleteNode = () => {
    const submitData = {
      identity: activeNode.identity,
      update_parent_id: activeNode.parent_id,
      delete_node_id: activeNode.uid,
    };
    axiosInstance
      .post(`/book/delete_book_node`, submitData)
      .then(({ data }) => {
        let __activeNode = null;
        if (activeNode.identity === 101) {
          const newNodes = deleteOne(nodes101, data, submitData);
          setNodes101(newNodes);
          __activeNode = frontPage;
        }
        if (activeNode.identity === 102) {
          const newNodes = deleteOne(activeSectionsByPageId, data, submitData);
          setActiveSectionsByPageId(newNodes);
          setAllSectionsByPageId({
            ...allSectionsByPageId,
            [page_id]: newNodes,
          });
          let newActiveNode = null;
          nodes101.forEach((x) => {
            if (x.uid === page_id) {
              newActiveNode = x;
            }
          });
          __activeNode = newActiveNode;
        }
        if (activeNode.identity === 103) {
          const newNodes = deleteOne(activeSubSectionsBySectionId, data, submitData);
          setActiveSubSectionsBySectionId(newNodes);
          setAllSubSectionsBySectionId({
            ...allSubSectionsBySectionId,
            [section_id]: newNodes,
          });
        }
        setState({
          ...state,
          activeNode: __activeNode,
        });
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
    const r = nodes101.map((n) => {
      if (n.uid === activeNode.uid) {
        const t = {
          ...n,
          ...data,
        };
        __activeNode = t;
        return t;
      }
      return n;
    });
    setNodes101(r);
    setState({
      ...state,
      activeNode: __activeNode,
      modal: '',
    });
  };
  const editSection = (data) => {
    let __activeNode = null;
    const r = activeSectionsByPageId.map((n) => {
      if (n.uid === activeNode.uid) {
        const t = {
          ...n,
          ...data,
        };
        __activeNode = t;
        return t;
      }
      return n;
    });
    setActiveSectionsByPageId(r);
    setAllSectionsByPageId({
      ...allSectionsByPageId,
      [page_id]: r,
    });
    setState({
      ...state,
      activeNode: __activeNode,
      modal: '',
    });
  };
  const editSubSection = (data) => {
    let __activeNode = null;
    const r = activeSubSectionsBySectionId.map((n) => {
      if (n.uid === activeNode.uid) {
        const t = {
          ...n,
          ...data,
        };
        __activeNode = t;
        return t;
      }
      return n;
    });
    setActiveSubSectionsBySectionId(r);
    setAllSubSectionsBySectionId({
      ...allSubSectionsBySectionId,
      [section_id]: r,
    });
    setState({
      ...state,
      activeNode: __activeNode,
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

  const reset = (e) => {
    setActiveSubSectionsBySectionId([]);
    e.stopPropagation();
    setState({
      ...state,
      modal: '',
    });
  };

  const editFnCallback = (data) => {
    if (activeNode.identity === 100) {
      updateFrontPage(data);
    }
    if (activeNode.identity === 101) {
      editPage(data);
    }
    if (activeNode.identity === 102) {
      editSection(data);
    }
    if (activeNode.identity === 103) {
      editSubSection(data);
    }
  };

  const addChapterFnCb = (data, err) => {
    const newNodes = appendChapters(nodes101, activeNode, data);
    setNodes101(newNodes);
    setState({
      ...state,
      activeNode: data.new_node,
      modal: '',
    });
  };

  const addSectionFnCb = (data, err) => {
    const newRawNodes = appendSections(activeSectionsByPageId, activeNode, data);
    setActiveSectionsByPageId(newRawNodes);
    setAllSectionsByPageId((prevState) => ({
      ...prevState,
      [page_id]: newRawNodes,
    }));
    let newActiveNode = null;
    newRawNodes.forEach((b) => {
      if (b.uid === data.new_node.uid) {
        newActiveNode = b;
      }
    });
    setState({
      ...state,
      section_id: newActiveNode.uid,
      activeNode: newActiveNode,
      modal: '',
    });
  };

  const addSubSectionFnCb = (data, err) => {
    const newRawNodes = appendSubSections(activeSubSectionsBySectionId, activeNode, data);
    setActiveSubSectionsBySectionId(newRawNodes);
    setAllSubSectionsBySectionId((prevState) => ({
      ...prevState,
      [page_id]: newRawNodes,
    }));
    setState({
      ...state,
      modal: '',
    });
  };

  const closeComponent = () => {
    setState({
      ...state,
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
        {/*
         * @ Left Navigation
         */}
        <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
          <div className='chapter-nav cursor'>
            <div
              className='chapter-nav'
              onClick={(e) => {
                setState({
                  ...state,
                  page_id: frontPage.uid,
                  activeNode: frontPage,
                });
                reset(e);
              }}
            >
              {frontPage.title}
            </div>
          </div>
          <div
            className='button-none'
            onClick={(e) => {
              reset(e);
              setState({
                ...state,
                page_id: frontPage.uid,
                activeNode: frontPage,
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
                      reset(e);
                      getSections(chapter);
                      setState({
                        ...state,
                        page_id: chapter.uid,
                        activeNode: chapter,
                      });
                    }}
                  >
                    <div style={{ width: '90%' }}>{chapter.title}</div>
                    <div>
                      {activeNode.uid === chapter.uid ? (
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
                          activeNode: chapter,
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
                            activeNode: chapter,
                            page_id: chapter.uid,
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
                                reset(e);
                                getSubSections(section);
                                setState({
                                  ...state,
                                  activeNode: section,
                                  page_id: section.uid,
                                });
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
                                  activeNode: section,
                                  page_id: section.uid,
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

        {/* Page */}
        <div
          style={{
            width: '60%',
            paddingTop: 15,
            paddingLeft: '5%',
            paddingRight: '5%',
            background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
            paddingBottom: 50,
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
                      activeNode: activeNode,
                      page_id: activeNode.uid,
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
                    activeNode: activeNode,
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
                    activeNode: activeNode,
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
                          activeNode: subSectionNode,
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
                          activeNode: subSectionNode,
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
                          activeNode: subSectionNode,
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
          parent_id={activeNode.uid}
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
          parent_id={activeNode.uid}
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
          parent_id={activeNode.uid}
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
          confirmAction={deleteNode}
          title='Delete Page'
          onCancel={onCancel}
        />
      ) : null}

      {modal === 'delete_node' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Node?'
          confirmAction={deleteNode}
          title='Delete Node'
          onCancel={onCancel}
        />
      ) : null}
    </div>
  );
}
