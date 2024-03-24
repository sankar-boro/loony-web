import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import AddNode from './AddNode';
import { orderBlogNodes, deleteBlogNode } from 'loony-utils';
import { useHistory } from '../Router';

export default function Edit({ book_id }) {
  const { goBack } = useHistory();
  const [bookNodes, setBookNodes] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [page_id, setPageId] = useState('');

  useEffect(() => {
    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        setBookNodes(orderBlogNodes(data.data));
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
        .post(`/blog/delete_book_node`, submitData)
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
                <div className='section-title'>{book_node.title}</div>
                <div className='flex-row'>
                  <div
                    className='button-none cursor'
                    onClick={() => {
                      setActiveNode(book_node);
                      setPageId(book_node.uid);
                    }}
                    style={{ marginRight: 16 }}
                  >
                    Add Node
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ width: '80%' }}>
          {bookNodes.map((book_node, node_index) => {
            return (
              <div style={{ marginBottom: 16 }} key={book_node.uid}>
                <div className='section-title'>{book_node.title}</div>
                <Markdown>{book_node.body}</Markdown>
                <div className='flex-row'>
                  <div
                    className='button-none cursor'
                    onClick={() => {
                      setActiveNode(book_node);
                    }}
                    style={{ marginRight: 16 }}
                  >
                    Add Node
                  </div>
                  <div
                    className='delete-button-none cursor'
                    onClick={() => {
                      deleteNode(book_node, node_index);
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

      <AddNode
        activeNode={activeNode}
        setActiveNode={setActiveNode}
        book_id={book_id}
        setBookNodes={setBookNodes}
        bookNodes={bookNodes}
        page_id={page_id}
      />
    </div>
  );
}
