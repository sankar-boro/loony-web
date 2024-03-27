import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import AddNode from './AddNode';
import { orderBookNodes, deleteBookNode } from 'loony-utils';
import { useHistory } from '../Router';
import AddSection from './AddSection';
import AddSubSection from './AddSubSection';
import EditSubSection from './EditSubSection';

export default function Edit({ book_id }) {
  const { goBack, replaceState } = useHistory();
  const [rawNodes, setRawNodes] = useState([]);
  const [bookNodes, setBookNodes] = useState(null);
  const [activity, setActivity] = useState({
    modal: '',
    page_id: '',
    mainNode: null,
    activeNode: null,
  });
  const [mainNode, setMainNode] = useState(null);
  const [childNodes, setChildNodes] = useState([]);

  useEffect(() => {
    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        setRawNodes(data.data);
        const books_ = orderBookNodes(data.data);
        const mainNode_ = books_ && books_[0];
        const childNodes_ = mainNode_.child;

        if (mainNode_) {
          setMainNode(mainNode_);
          setChildNodes(childNodes_);
          setBookNodes(books_);
          setActivity({
            ...activity,
            mainNode: mainNode_,
            page_id: mainNode_.uid,
          });
        }
      });
    }
  }, [book_id]);

  const deleteNode = (delete_node) => {
    if (childNodes) {
      let updateNode = null;
      childNodes.forEach((c, i) => {
        if (delete_node.uid === c.uid) {
          if (childNodes[i + 1]) {
            updateNode = childNodes[i + 1];
          }
        }
      });
      const submitData = {
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
            setBookNodes(books_);
            setActivity({
              ...activity,
              mainNode: mainNode_,
              page_id: mainNode_.uid,
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

  return (
    <div className='con-75'>
      <div onClick={goBack} className='button-none' style={{ marginBottom: 16 }}>
        Back
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '20%' }}>
          {bookNodes.map((book_node) => {
            return (
              <>
                <div className='chapter-nav' key={book_node.uid}>
                  <div
                    className='book-nav-title'
                    onClick={(e) => {
                      e.stopPropagation();
                      setMainNode(book_node);
                      setChildNodes(book_node.child);
                    }}
                  >
                    {book_node.title}
                  </div>
                  <div className='flex-row'>
                    <div
                      className='button-none cursor'
                      onClick={() => {
                        setActivity({
                          ...activity,
                          activeNode: book_node,
                          page_id: book_node.uid,
                          modal: 'add_chapter',
                        });
                      }}
                      style={{ marginRight: 16 }}
                    >
                      Add Chapter
                    </div>
                  </div>
                  <div
                    className='button-none cursor'
                    style={{ paddingLeft: 20 }}
                    onClick={() => {
                      setActivity({
                        ...activity,
                        activeNode: book_node,
                        page_id: book_node.uid,
                        modal: 'add_section',
                      });
                    }}
                  >
                    Add Section
                  </div>
                </div>
                <div style={{ paddingLeft: 20 }}>
                  {book_node.child.map((section) => {
                    return (
                      <div key={section.uid} className='section-nav'>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setMainNode(section);
                            setChildNodes(section.child);
                          }}
                        >
                          {section.title}
                        </div>
                        <div
                          className='button-none cursor'
                          onClick={() => {
                            setActivity({
                              ...activity,
                              activeNode: section,
                              page_id: section.uid,
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
              </>
            );
          })}
        </div>
        <div style={{ width: '80%' }}>
          <div>
            <div className='page-heading'>{mainNode.title}</div>
            {mainNode.identity === 100 ? (
              <div style={{ marginTop: 50 }} className='flex-row'>
                <div className='button-none cursor' onClick={deleteBook}>
                  Delete Book
                </div>
                <div
                  className='button-none cursor'
                  onClick={() => {
                    setActivity({
                      ...activity,
                      activeNode: mainNode,
                      page_id: mainNode.uid,
                      modal: 'edit_sub_section',
                    });
                  }}
                  style={{ marginLeft: 16 }}
                >
                  Edit
                </div>
              </div>
            ) : null}
            <Markdown>{mainNode.body}</Markdown>
          </div>
          {mainNode.identity === 102 ? (
            <div className='flex-row'>
              <div
                className='button-none cursor'
                onClick={() => {
                  setActivity({
                    ...activity,
                    activeNode: mainNode,
                    page_id: mainNode.uid,
                    modal: 'add_sub_section',
                  });
                }}
              >
                Add Node
              </div>
              <div
                className='button-none cursor'
                onClick={() => {
                  setActivity({
                    ...activity,
                    activeNode: mainNode,
                    page_id: mainNode.uid,
                    modal: 'edit_sub_section',
                  });
                }}
                style={{ marginLeft: 16 }}
              >
                Edit
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: 16 }}>
            {mainNode.identity !== 101 &&
              childNodes.map((node, node_index) => {
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
                            page_id: node.uid,
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
                          deleteNode(node);
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
    </div>
  );
}
