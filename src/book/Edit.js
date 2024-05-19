import { useState, useEffect, useContext } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

import { orderBookNodes, deleteBookNode, extractImage } from 'loony-utils';
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

  const [rawNodes, setRawNodes] = useState([]);
  const [mainChapter, setMainchapter] = useState(null);
  const [bookNodes, setBookNodes] = useState(null);
  const [mainNode, setMainNode] = useState(null);
  const [childNodes, setChildNodes] = useState([]);
  const [navNodes, setNavNodes] = useState([]);
  const [modal, setModal] = useState('');
  const [activeNode, setActiveNode] = useState(null);
  const [page_id, setPageId] = useState(null);
  const [section_id, setSectionId] = useState(null);

  useEffect(() => {
    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        setRawNodes(data.data);
        const books_ = orderBookNodes(data.data);
        const mainNode_ = books_ && books_[0];
        const childNodes_ = books_.slice(1);

        if (mainNode_) {
          setMainNode(mainNode_);
          setMainchapter(mainNode_);
          setNavNodes(childNodes_);
          setBookNodes(books_);
        }
      });
    }
  }, [book_id]);

  const deleteNode = () => {
    const delete_node = activeNode;
    if (childNodes) {
      const submitData = {
        identity: delete_node.identity,
        update_parent_id: delete_node.parent_id,
        delete_node_id: delete_node.uid,
      };
      axiosInstance
        .post(`/book/delete_book_node`, submitData)
        .then(({ data }) => {
          const newNodes = deleteBookNode(rawNodes, data, submitData);
          setRawNodes(newNodes);
          const books_ = orderBookNodes(newNodes);
          setBookNodes(books_);
          let d = [];
          if (delete_node.identity === 103) {
            books_.forEach((b) => {
              b.child.forEach((c) => {
                if (c.uid === section_id) {
                  d = c.child;
                }
              });
            });
          }
          setChildNodes(d);
          setModal('');
        })
        .catch((err) => {
          console.log(err);
        });
    }
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

  if (!bookNodes) return null;
  const image = extractImage(mainNode.images);

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
                setMainNode(mainChapter);
                setChildNodes(mainChapter.child);
                setPageId(mainChapter.uid);
                setModal('');
                e.stopPropagation();
              }}
            >
              {mainChapter.title}
            </div>
          </div>
          <div
            className='button-none'
            onClick={(e) => {
              setActiveNode(mainChapter);
              setMainNode(mainChapter);
              setPageId(mainChapter.uid);
              setModal('add_chapter');
              e.stopPropagation();
            }}
            style={{ marginRight: 16, paddingTop: 7, paddingBottom: 7 }}
          >
            Add Chapter
          </div>
          {navNodes.map((chapter) => {
            return (
              <div key={chapter.uid}>
                <div className='chapter-nav-con cursor' key={chapter.uid}>
                  <div
                    className='chapter-nav'
                    onClick={(e) => {
                      setMainNode(chapter);
                      setPageId(chapter.uid);
                      setChildNodes([]);
                      e.stopPropagation();
                    }}
                  >
                    <div style={{ width: '90%' }}>{chapter.title}</div>
                    <div>
                      {mainNode.uid === chapter.uid ? (
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
                    chapter.child.map((section) => {
                      return (
                        <div key={section.uid} className='section-nav cursor'>
                          <div
                            onClick={(e) => {
                              setMainNode(section);
                              setChildNodes(section.child);
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
            <div className='page-heading'>{mainNode.title}</div>
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
              source={mainNode.body}
              wrapperElement={{ 'data-color-mode': 'light' }}
            />
          </div>
          {mainNode.identity >= 101 ? (
            <div className='flex-row'>
              {mainNode.identity === 102 ? (
                <div
                  className='button-none cursor'
                  onClick={() => {
                    setActiveNode(mainNode);
                    setPageId(mainNode.uid);
                    setModal('add_sub_section');
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
                onClick={() => {
                  setActiveNode(mainNode);
                  setModal('delete_page');
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
            {mainNode.identity !== 101 &&
              childNodes.map((node) => {
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
                        onClick={() => {
                          setActiveNode(node);
                          setPageId(mainNode.uid);
                          setModal('add_sub_section');
                        }}
                        style={{ marginRight: 16 }}
                      >
                        <div className='btn-action'>
                          <MdAdd size={16} color='#9c9c9c' />
                        </div>
                      </div>
                      <div
                        className='button-none cursor'
                        onClick={() => {
                          setActiveNode(node);
                          setPageId(node.uid);
                          setModal('edit_node');
                        }}
                        style={{ marginRight: 16 }}
                      >
                        <div className='btn-action'>
                          <FiEdit2 size={16} color='#9c9c9c' />
                        </div>
                      </div>
                      <div
                        className='delete-button-none cursor'
                        onClick={() => {
                          setActiveNode(node);
                          setModal('delete_node');
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
                  setActiveNode(mainNode);
                  setPageId(mainNode.uid);
                  setModal('edit_node');
                }}
              >
                {mainNode.title}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {modal === 'add_chapter' ? (
        <AddNode
          activeNode={activeNode}
          book_id={book_id}
          setBookNodes={setBookNodes}
          setRawNodes={setRawNodes}
          setMainNode={setMainNode}
          setNavNodes={setNavNodes}
          rawNodes={rawNodes}
          bookNodes={bookNodes}
          page_id={page_id}
          onClose={() => {
            setActiveNode(null);
          }}
        />
      ) : null}

      {modal === 'add_section' ? (
        <AddSection
          activeNode={activeNode}
          book_id={book_id}
          setBookNodes={setBookNodes}
          setRawNodes={setRawNodes}
          setMainNode={setMainNode}
          setNavNodes={setNavNodes}
          rawNodes={rawNodes}
          bookNodes={bookNodes}
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
          setBookNodes={setBookNodes}
          setRawNodes={setRawNodes}
          setMainNode={setMainNode}
          setChildNodes={setChildNodes}
          rawNodes={rawNodes}
          bookNodes={bookNodes}
          page_id={page_id}
          onClose={() => {
            setActiveNode(null);
          }}
        />
      ) : null}

      {modal === 'edit_node' ? (
        <EditNode
          activeNode={activeNode}
          book_id={book_id}
          setBookNodes={setBookNodes}
          setRawNodes={setRawNodes}
          setMainNode={setMainNode}
          setChildNodes={setChildNodes}
          setNavNodes={setNavNodes}
          rawNodes={rawNodes}
          bookNodes={bookNodes}
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
