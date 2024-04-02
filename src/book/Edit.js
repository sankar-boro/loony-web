import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import AddNode from './AddNode';
import { orderBookNodes, deleteBookNode, extractImage } from 'loony-utils';
import { useHistory } from '../Router';
import AddSection from './AddSection';
import AddSubSection from './AddSubSection';
import EditSubSection from './EditSubSection';
import ConfirmAction from './ConfirmAction';

export default function Edit({ book_id }) {
  const { replaceState } = useHistory();
  const [rawNodes, setRawNodes] = useState([]);
  const [mainChapter, setMainchapter] = useState(null);
  const [bookNodes, setBookNodes] = useState(null);
  const [activity, setActivity] = useState({
    modal: '',
    page_id: null,
    mainNode: null,
    activeNode: null,
  });
  const [mainNode, setMainNode] = useState(null);
  const [childNodes, setChildNodes] = useState([]);
  const [navNodes, setNavNodes] = useState([]);
  const [nav_id, setNavId] = useState(null);

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
          setActivity({
            ...activity,
            mainNode: mainNode_,
            page_id: mainNode_.uid,
          });
        }
      });
    }
  }, [book_id]);

  const deleteNode = () => {
    const delete_node = activity.activeNode;
    if (childNodes) {
      let updateNode = null;
      bookNodes.forEach((b, i) => {
        if (b.uid === delete_node.uid) {
          if (bookNodes[i + 1]) {
            updateNode = childNodes[i + 1];
          }
        } else {
          b.child.forEach((x, ii) => {
            if (x.uid === delete_node.uid) {
              if (b.child[ii + 1]) {
                updateNode = b.child[ii + 1];
              }
            }
          });
        }
      });

      const submitData = {
        page_id: activity.page_id,
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
          const childNodes_ = mainNode_.child;

          if (mainNode_) {
            setMainNode(mainNode_);
            setChildNodes(childNodes_);
            setNavNodes(childNodes_);
            setBookNodes(books_);
            setActivity({
              ...activity,
              mainNode: mainNode_,
              page_id: mainNode_.uid,
              modal: '',
            });
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
                setMainNode(mainChapter);
              }}
            >
              {mainChapter.title}
            </div>
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
                      setActivity({
                        ...activity,
                        page_id: chapter.uid,
                      });
                    }}
                  >
                    {chapter.title} {`>`}
                  </div>
                  <div className='flex-row' style={{ paddingTop: 5, paddingBottom: 5 }}>
                    <div
                      className='button-none'
                      onClick={() => {
                        setActivity({
                          ...activity,
                          activeNode: chapter,
                          modal: 'add_chapter',
                        });
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
                      setActivity({
                        ...activity,
                        activeNode: chapter,
                        page_id: chapter.uid,
                        modal: 'add_section',
                      });
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
                              setActivity({
                                ...activity,
                                page_id: section.uid,
                              });
                            }}
                          >
                            {section.title}
                          </div>
                          <div
                            className='button-none'
                            style={{ paddingTop: 5, paddingBottom: 5 }}
                            onClick={() => {
                              setActivity({
                                ...activity,
                                activeNode: section,
                                page_id: chapter.uid,
                                modal: 'add_section',
                              });
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
              <div
                className='button-none cursor'
                onClick={() => {
                  setActivity({
                    ...activity,
                    activeNode: mainNode,
                    modal: 'add_sub_section',
                  });
                }}
                style={{ marginRight: 10 }}
              >
                Add Node
              </div>
              <div
                className='button-none cursor'
                onClick={() => {
                  setActivity({
                    ...activity,
                    activeNode: mainNode,
                    modal: 'delete_page',
                  });
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
                  <div style={{ marginBottom: 16 }} key={node.uid}>
                    <div className='section-title'>{node.title}</div>
                    <Markdown>{node.body}</Markdown>
                    <div className='flex-row'>
                      <div
                        className='button-none cursor'
                        onClick={() => {
                          setActivity({
                            ...activity,
                            activeNode: node,
                            page_id: mainNode.uid,
                            modal: 'add_sub_section',
                          });
                        }}
                        style={{ marginRight: 16 }}
                      >
                        Add Node
                      </div>
                      <div
                        className='button-none cursor'
                        onClick={() => {
                          setActivity({
                            ...activity,
                            activeNode: node,
                            page_id: node.uid,
                            modal: 'edit_sub_section',
                          });
                        }}
                        style={{ marginRight: 16 }}
                      >
                        Edit
                      </div>
                      <div
                        className='delete-button-none cursor'
                        onClick={() => {
                          setActivity({
                            ...activity,
                            activeNode: node,
                            modal: 'delete_node',
                          });
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
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            <li
              onClick={() => {
                replaceState({}, null, `/view?name=book&book_id=${book_id}`);
              }}
            >
              Read Book
            </li>
            <li
              onClick={() => {
                setActivity({
                  ...activity,
                  modal: 'delete_book',
                });
              }}
            >
              Delete Book
            </li>
            <li>Report</li>
          </ul>
          <div style={{ borderTop: '1px solid #ccc', marginTop: 5, paddingTop: 5 }}>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              <li
                onClick={() => {
                  setActivity({
                    ...activity,
                    activeNode: mainNode,
                    page_id: mainNode.uid,
                    modal: 'edit_sub_section',
                  });
                }}
              >
                {mainNode.title}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {activity.modal === 'add_chapter' ? (
        <AddNode
          activeNode={activity.activeNode}
          setActivity={setActivity}
          book_id={book_id}
          setBookNodes={setBookNodes}
          setRawNodes={setRawNodes}
          setMainNode={setMainNode}
          setChildNodes={setChildNodes}
          rawNodes={rawNodes}
          bookNodes={bookNodes}
          page_id={activity.page_id}
        />
      ) : null}

      {activity.modal === 'add_section' ? (
        <AddSection
          activeNode={activity.activeNode}
          setActivity={setActivity}
          book_id={book_id}
          setBookNodes={setBookNodes}
          setRawNodes={setRawNodes}
          setMainNode={setMainNode}
          setChildNodes={setChildNodes}
          rawNodes={rawNodes}
          bookNodes={bookNodes}
          page_id={activity.page_id}
        />
      ) : null}

      {activity.modal === 'add_sub_section' ? (
        <AddSubSection
          activeNode={activity.activeNode}
          setActivity={setActivity}
          book_id={book_id}
          setBookNodes={setBookNodes}
          setRawNodes={setRawNodes}
          setMainNode={setMainNode}
          setChildNodes={setChildNodes}
          rawNodes={rawNodes}
          bookNodes={bookNodes}
          page_id={activity.page_id}
        />
      ) : null}

      {activity.modal === 'edit_sub_section' ? (
        <EditSubSection
          activeNode={activity.activeNode}
          setActivity={setActivity}
          book_id={book_id}
          setBookNodes={setBookNodes}
          setRawNodes={setRawNodes}
          setMainNode={setMainNode}
          setChildNodes={setChildNodes}
          rawNodes={rawNodes}
          bookNodes={bookNodes}
          page_id={activity.page_id}
        />
      ) : null}

      {activity.modal === 'delete_book' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Book?'
          confirmAction={deleteBook}
          title='Delete Book'
          onClose={() => {
            setActivity({ ...activity, modal: '' });
          }}
        />
      ) : null}

      {activity.modal === 'delete_page' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Page?'
          confirmAction={deleteNode}
          title='Delete Book'
          onClose={() => {
            setActivity({ ...activity, modal: '' });
          }}
        />
      ) : null}

      {activity.modal === 'delete_node' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Node?'
          confirmAction={deleteNode}
          title='Delete Book'
          onClose={() => {
            setActivity({ ...activity, modal: '' });
          }}
        />
      ) : null}
    </div>
  );
}
