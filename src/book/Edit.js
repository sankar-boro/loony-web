import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import AddNode from './AddNode';
import { orderBookNodes, deleteBlogNode } from 'loony-utils';
import { useHistory } from '../Router';
import AddSection from './AddSection';
import AddSubSection from './AddSubSection';

export default function Edit({ book_id }) {
  const { goBack } = useHistory();
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

  const deleteNode = (delete_node, delete_node_index) => {
    if (bookNodes) {
      const updateNode = bookNodes[delete_node_index + 1] || null;
      const submitData = {
        update_parent_id: delete_node.parent_id,
        delete_node_id: delete_node.uid,
        update_node_id: updateNode ? updateNode.uid : null,
      };
      axiosInstance
        .post(`/book/delete_book_node`, submitData)
        .then(() => {
          setBookNodes(deleteBlogNode(bookNodes, submitData, delete_node_index));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (!bookNodes) return null;

  return (
    <div className='con-75'>
      <div onClick={goBack} className='button-none' style={{ marginBottom: 16 }}>
        Back
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '20%' }}>
          {bookNodes.map((book_node, node_index) => {
            return (
              <div style={{ marginBottom: 16 }} key={book_node.uid}>
                <div
                  className='section-title'
                  // onClick={() => {
                  //   setActivity({
                  //     ...activity,
                  //     page_id: book_node.uid,
                  //   });
                  // }}
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
                <div style={{ paddingLeft: 20 }}>
                  {book_node.child.map((section) => {
                    return (
                      <div key={section.uid}>
                        <div
                          style={{ fontSize: 18, fontWeight: 'bold' }}
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
              </div>
            );
          })}
        </div>
        <div style={{ width: '80%' }}>
          <div className='page-section'>
            <div className='section-title'>{mainNode.title}</div>
            <Markdown>{mainNode.body}</Markdown>
          </div>
          {mainNode.identity === 102 ? (
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
          ) : null}
          {mainNode.identity !== 101 &&
            childNodes.map((section, node_index) => {
              return (
                <div style={{ marginBottom: 16 }} key={section.uid}>
                  <div className='section-title'>{section.title}</div>
                  <Markdown>{section.body}</Markdown>
                  <div className='flex-row'>
                    <div
                      className='button-none cursor'
                      onClick={() => {
                        setActivity({
                          ...activity,
                          activeNode: section,
                          page_id: section.uid,
                          modal: 'add_sub_section',
                        });
                      }}
                      style={{ marginRight: 16 }}
                    >
                      Add Node
                    </div>
                    <div
                      className='delete-button-none cursor'
                      onClick={() => {
                        deleteNode(section, node_index);
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

      {activity.modal === 'add_chapter' ? (
        <AddNode
          activeNode={activity.activeNode}
          setActivity={setActivity}
          book_id={book_id}
          setBookNodes={setBookNodes}
          setRawNodes={setRawNodes}
          bookNodes={rawNodes}
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
          bookNodes={rawNodes}
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
          bookNodes={rawNodes}
          page_id={activity.page_id}
        />
      ) : null}
    </div>
  );
}
