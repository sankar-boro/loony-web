import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { orderBookNodes, deleteBookNode, extractImage } from 'loony-utils';
import { RxReader } from 'react-icons/rx';
import { AiOutlineDelete } from 'react-icons/ai';
import { LuFileWarning } from 'react-icons/lu';

import AddNode from './AddNode';
import { axiosInstance } from '../query';
import { useHistory } from '../Router';
import AddSection from './AddSection';
import AddSubSection from './AddSubSection';
import EditNode from './EditNode';
import ConfirmAction from './ConfirmAction';

export default function Edit({ book_id: bookId }) {
  const book_id = parseInt(bookId);
  const { replaceState } = useHistory();
  const [rawNodes, setRawNodes] = useState([]);
  const [mainChapter, setMainchapter] = useState(null);
  const [bookNodes, setBookNodes] = useState(null);
  const [mainNode, setMainNode] = useState(null);
  const [childNodes, setChildNodes] = useState([]);
  const [navNodes, setNavNodes] = useState([]);
  const [nav_id, setNavId] = useState(null);
  const [modal, setModal] = useState('');
  const [page_id, setPageId] = useState(null);
  const [activeNode, setActiveNode] = useState(null);

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
          setNavId(mainNode_.uid);
          setPageId(mainNode_.uid);
        }
      });
    }
  }, [book_id]);

  const deleteNode = () => {
    const delete_node = activeNode;
    if (childNodes) {
      let updateNode = null;
      rawNodes.forEach((r) => {
        if (r.parent_id === delete_node.uid) {
          updateNode = r;
        }
      });

      const submitData = {
        page_id,
        identity: delete_node.identity,
        update_parent_id: delete_node.parent_id,
        delete_node_id: delete_node.uid,
        update_node_id: updateNode ? updateNode.uid : null,
      };
      axiosInstance
        .post(`/book/delete_book_node`, submitData)
        .then(() => {
          const newNodes = deleteBookNode(rawNodes, delete_node, submitData);
          setRawNodes(newNodes);
          const books_ = orderBookNodes(newNodes);
          const mainNode_ = books_ && books_[0];
          const childNodes_ = books_.slice(1);

          if (mainNode_) {
            setMainNode(mainNode_);
            setNavNodes(childNodes_);
            setBookNodes(books_);
            setPageId(mainNode_.uid);
            setModal('');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteBook = () => {
    axiosInstance.post('/book/delete_book', { book_id: parseInt(book_id) }).then(() => {
      replaceState({}, null, '/');
    });
  };

  if (!bookNodes) return null;
  const image = extractImage(mainNode.images);

  return (
    <div className='book-container'>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
          <div className='chapter-nav cursor'>
            <div
              className='book-nav-title'
              onClick={(e) => {
                e.stopPropagation();
                setModal('');
                setActiveNode(mainChapter);
                setMainNode(mainChapter);
                setNavId(mainChapter.uid);
                setPageId(mainChapter.uid);
              }}
            >
              {mainChapter.title}
            </div>
          </div>
          <div
            className='button-none'
            onClick={() => {
              setActiveNode(mainChapter);
              setMainNode(mainChapter);
              setNavId(mainChapter.uid);
              setPageId(mainChapter.uid);
              setModal('add_chapter');
            }}
            style={{ marginRight: 16 }}
          >
            Add Chapter
          </div>
          {navNodes.map((chapter) => {
            return (
              <div key={chapter.uid}>
                <div className='chapter-nav cursor' key={chapter.uid}>
                  <div
                    className='book-nav-title'
                    onClick={(e) => {
                      e.stopPropagation();
                      setMainNode(chapter);
                      setNavId(chapter.uid);
                      setPageId(chapter.uid);
                    }}
                  >
                    {chapter.title} {`>`}
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
                  {nav_id === chapter.uid &&
                    chapter.child.map((section) => {
                      return (
                        <div key={section.uid} className='section-nav cursor'>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setMainNode(section);
                              setChildNodes(section.child);
                              setPageId(chapter.uid);
                            }}
                          >
                            {section.title}
                          </div>
                          <div
                            className='button-none'
                            style={{ paddingTop: 5, paddingBottom: 5 }}
                            onClick={() => {
                              setActiveNode(section);
                              setPageId(chapter.uid);
                              setModal('add_section');
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
        <div
          style={{
            width: '60%',
            paddingTop: 15,
            paddingLeft: '5%',
            paddingRight: '5%',
            background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
          }}
        >
          <div>
            <div className='page-heading'>{mainNode.title}</div>
            {image ? (
              <div style={{ width: '50%', border: '1px solid #ccc', borderRadius: 5 }}>
                <img src={`http://localhost:5002/api/i/${image.name}`} alt='' width='100%' />
              </div>
            ) : null}
            <Markdown>{mainNode.body}</Markdown>
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
                  Add Node
                </div>
              ) : null}

              <div
                className='button-none cursor'
                onClick={() => {
                  setActiveNode(mainNode);
                  setModal('delete_page');
                }}
              >
                Delete Page
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: 16 }}>
            {mainNode.identity !== 101 &&
              childNodes.map((node) => {
                return (
                  <div style={{ marginBottom: 25, marginTop: 25 }} key={node.uid}>
                    <div className='section-title'>{node.title}</div>
                    <Markdown>{node.body}</Markdown>
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
                        Add Node
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
                        Edit
                      </div>
                      <div
                        className='delete-button-none cursor'
                        onClick={() => {
                          setActiveNode(node);
                          setModal('delete_node');
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
          <ul style={{ paddingLeft: 0, listStyle: 'none' }} className='list-item'>
            <li
              onClick={() => {
                replaceState({}, null, `/view?name=book&book_id=${book_id}`);
              }}
            >
              <RxReader size={16} color='#2d2d2d' /> Read Book
            </li>
            <li
              onClick={() => {
                setModal('delete_book');
              }}
            >
              <AiOutlineDelete size={16} color='#2d2d2d' /> Delete Book
            </li>
            <li>
              <LuFileWarning size={16} color='#2d2d2d' /> Report
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
