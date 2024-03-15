import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import AddNode from './AddNode';
import { orderBlogNodes, deleteBookNode } from 'loony-utils';

export default function Edit() {
  const [bookNodes, setBookNodes] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const book_id = searchParams.get('book_id');
  useEffect(() => {
    axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
      setBookNodes(orderBlogNodes(data.data));
    });
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
          setBookNodes(deleteBookNode(bookNodes, submitData, delete_node_index));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  if (!bookNodes) return null;

  return (
    <div className='con-75'>
      {bookNodes.map((book_node, node_index) => {
        return (
          <div key={book_node.uid}>
            <div className='section-title'>{book_node.title}</div>
            <Markdown>{book_node.body}</Markdown>
            <button
              onClick={() => {
                setActiveNode(book_node);
              }}
            >
              Add Node
            </button>
            <button
              onClick={() => {
                deleteNode(book_node, node_index);
              }}
            >
              Delete
            </button>
          </div>
        );
      })}

      <AddNode activeNode={activeNode} setActiveNode={setActiveNode} book_id={book_id} />
    </div>
  );
}
