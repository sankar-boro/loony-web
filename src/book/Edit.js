import { useState, useEffect, useContext } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

import { orderBookNodes, deleteBookNode, extractImage, orderNodes } from 'loony-utils';
import { RxReader } from 'react-icons/rx';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdAdd } from 'react-icons/md';
import { LuFileWarning } from 'react-icons/lu';
import { FiEdit2 } from 'react-icons/fi';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useParams, Link, useNavigate } from 'react-router-dom';

import AddNode from './AddNode';
import { axiosInstance } from '../query';
import AddSection from './AddSection';
import AddSubSection from './AddSubSection';
import EditNode from './EditNode';
import ConfirmAction from './ConfirmAction';
import { AuthContext } from '../context/AuthContext';

export default function Edit() {
  const { bookId } = useParams();
  const book_id = parseInt(bookId);
  const navigate = useNavigate();
  const { setAuthContext } = useContext(AuthContext);

  const [frontPage, setFrontPage] = useState(null);
  const [nodes101, setNodes101] = useState([]);
  const [modal, setModal] = useState('');
  const [activeNode, setActiveNode] = useState(null);
  const [page_id, setPageId] = useState(null);
  const [section_id, setSectionId] = useState(null);
  const [activeSectionsByPageId, setActiveSectionsByPageId] = useState([]);
  const [allSectionsByPageId, setAllSectionsByPageId] = useState({});
  const [activeSubSectionsBySectionId, setActiveSubSectionsBySectionId] = useState([]);
  const [allSubSectionsBySectionId, setAllSubSectionsBySectionId] = useState({});

  useEffect(() => {
    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        const bookTree = orderBookNodes(data.data);
        const thisFrontPage = bookTree && bookTree[0];
        const pages = bookTree.slice(1);

        if (thisFrontPage) {
          setFrontPage(thisFrontPage);
          setActiveNode(thisFrontPage);
          setNodes101(pages);
          setPageId(thisFrontPage.uid);
        }
      });
    }
  }, [book_id]);

  useEffect(() => {
    if (page_id && activeNode.identity === 101 && !allSectionsByPageId[page_id]) {
      axiosInstance
        .get(`/book/get_book_sections?book_id=${book_id}&page_id=${page_id}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, activeNode);
          setActiveSectionsByPageId(res);
          setAllSectionsByPageId({
            ...allSectionsByPageId,
            [page_id]: res,
          });
        });
    }

    if (allSectionsByPageId[page_id]) {
      setActiveSectionsByPageId(allSectionsByPageId[page_id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page_id]);

  useEffect(() => {
    if (section_id && activeNode.identity === 102) {
      axiosInstance
        .get(`/book/get_book_sub_sections?book_id=${book_id}&page_id=${section_id}`)
        .then(({ data }) => {
          const res = orderNodes(data.data, activeNode);
          setActiveSubSectionsBySectionId(res);
          setAllSubSectionsBySectionId({
            ...allSubSectionsBySectionId,
            [page_id]: res,
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section_id]);

  const deleteNode = () => {
    const submitData = {
      identity: activeNode.identity,
      update_parent_id: activeNode.parent_id,
      delete_node_id: activeNode.uid,
    };
    axiosInstance
      .post(`/book/delete_book_node`, submitData)
      .then(({ data }) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteBook = () => {
    axiosInstance.post('/book/delete_book', { book_id: parseInt(book_id) }).then(() => {
      setModal('');
      setAuthContext('alert', {
        alertType: 'success',
        title: 'Deleted Book',
        body: 'Your book has been successfully deleted.',
      });
      navigate('/', { replace: true });
    });
  };

  if (!activeNode) return null;
  if (!nodes101) return null;
  const image = extractImage(activeNode.images);

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
                setPageId(frontPage.uid);
                setModal('');
                e.stopPropagation();
              }}
            >
              {frontPage.title}
            </div>
          </div>
          <div
            className='button-none'
            onClick={(e) => {
              setActiveNode(frontPage);
              setPageId(frontPage.uid);
              setModal('add_chapter');
              e.stopPropagation();
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
                      setActiveNode(chapter);
                      setPageId(chapter.uid);
                      e.stopPropagation();
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
                        setActiveNode(chapter);
                        setModal('add_chapter');
                      }}
                      style={{ marginRight: 16 }}
                    >
                      Add Chapter
                    </div>
                  </div>
                  <div
                    className='button-none'
                    style={{ paddingLeft: 20 }}
                    onClick={() => {
                      setActiveNode(chapter);
                      setPageId(chapter.uid);
                      setModal('add_section');
                    }}
                  >
                    Add Section
                  </div>
                </div>
                {/* Sections */}
                <div style={{ paddingLeft: 20 }}>
                  {page_id === chapter.uid &&
                    activeSectionsByPageId.map((section) => {
                      return (
                        <div key={section.uid} className='section-nav cursor'>
                          <div
                            onClick={(e) => {
                              setActiveNode(section);
                              setSectionId(section.uid);
                              e.stopPropagation();
                            }}
                          >
                            {section.title}
                          </div>
                          <div
                            className='button-none'
                            style={{ paddingTop: 5, paddingBottom: 5 }}
                            onClick={(e) => {
                              setActiveNode(section);
                              setSectionId(section.uid);
                              setModal('add_section');
                              e.stopPropagation();
                            }}
                          >
                            Add Section
                          </div>
                        </div>
                      );
                    })}
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
                  src={`${process.env.REACT_APP_BASE_API_URL}/api/i/${image.name}`}
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
          {activeNode.identity >= 101 ? (
            <div className='flex-row'>
              {activeNode.identity === 102 ? (
                <div
                  className='button-none cursor'
                  onClick={(e) => {
                    setActiveNode(activeNode);
                    setSectionId(activeNode.uid);
                    setModal('add_sub_section');
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
                  setActiveNode(activeNode);
                  setModal('delete_page');
                  e.stopPropagation();
                }}
              >
                <div className='btn-action'>
                  <AiOutlineDelete size={16} color='#9c9c9c' />
                </div>
              </div>
            </div>
          ) : null}

          <div
            style={{
              marginTop: 16,
            }}
          >
            {activeNode.identity !== 101 &&
              activeSubSectionsBySectionId.map((node) => {
                return (
                  <div style={{ marginBottom: 25, marginTop: 25 }} key={node.uid}>
                    <div className='section-title'>{node.title}</div>
                    <MarkdownPreview
                      source={node.body}
                      wrapperElement={{ 'data-color-mode': 'light' }}
                    />
                    <div className='flex-row'>
                      <div
                        className='button-none cursor'
                        onClick={(e) => {
                          setActiveNode(node);
                          setModal('add_sub_section');
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
                          setActiveNode(node);
                          setModal('edit_node');
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
                          setActiveNode(node);
                          setModal('delete_node');
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
                setModal('delete_book');
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
          <div style={{ borderTop: '1px solid #ccc', marginTop: 5, paddingTop: 5 }}>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              <li
                onClick={() => {
                  setActiveNode(activeNode);
                  setPageId(activeNode.uid);
                  setModal('edit_node');
                }}
              >
                {activeNode.title}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {modal === 'add_chapter' ? (
        <AddNode
          activeNode={activeNode}
          setActiveNode={setActiveNode}
          book_id={book_id}
          setNavNodes={setNodes101}
          nodes101={nodes101}
          page_id={page_id}
          onClose={() => {
            setActiveNode(null);
          }}
        />
      ) : null}

      {modal === 'add_section' ? (
        <AddSection
          activeNode={activeNode}
          setActiveNode={setActiveNode}
          book_id={book_id}
          allSectionsByPageId={allSectionsByPageId}
          activeSectionsByPageId={activeSectionsByPageId}
          setActiveSectionsByPageId={setActiveSectionsByPageId}
          setAllSectionsByPageId={setAllSectionsByPageId}
          nodes101={nodes101}
          setNodes101={setNodes101}
          page_id={page_id}
          onClose={() => {
            setActiveNode(null);
          }}
        />
      ) : null}

      {modal === 'add_sub_section' ? (
        <AddSubSection
          activeNode={activeNode}
          book_id={book_id}
          setActiveSubSectionsBySectionId={setActiveSubSectionsBySectionId}
          allSubSectionsBySectionId={allSubSectionsBySectionId}
          setAllSubSectionsBySectionId={setAllSubSectionsBySectionId}
          nodes101={nodes101}
          setNodes101={setNodes101}
          page_id={page_id}
          section_id={section_id}
          onClose={() => {
            setActiveNode(null);
          }}
        />
      ) : null}

      {modal === 'edit_node' ? (
        <EditNode
          book_id={book_id}
          activeNode={activeNode}
          setActiveNode={setActiveNode}
          setNavNodes={setNodes101}
          nodes101={nodes101}
          page_id={page_id}
          onClose={() => {
            setActiveNode(null);
          }}
        />
      ) : null}

      {modal === 'delete_book' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Book?'
          confirmAction={deleteBook}
          title='Delete Book'
          onClose={() => {
            setModal('');
          }}
        />
      ) : null}

      {modal === 'delete_page' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Page?'
          confirmAction={deleteNode}
          title='Delete Book'
          onClose={() => {
            setModal('');
          }}
        />
      ) : null}

      {modal === 'delete_node' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Node?'
          confirmAction={deleteNode}
          title='Delete Book'
          onClose={() => {
            setModal('');
          }}
        />
      ) : null}
    </div>
  );
}
