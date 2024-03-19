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
        .post(`/blog/delete_blog_node`, submitData)
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
      {bookNodes.map((blog_node, node_index) => {
        return (
          <div style={{ marginBottom: 16 }} key={blog_node.uid}>
            <div className='section-title'>{blog_node.title}</div>
            <Markdown>{blog_node.body}</Markdown>
            <div className='flex-row'>
              <div
                className='button-none cursor'
                onClick={() => {
                  setActiveNode(blog_node);
                }}
                style={{ marginRight: 16 }}
              >
                Add Node
              </div>
              <div
                className='delete-button-none cursor'
                onClick={() => {
                  deleteNode(blog_node, node_index);
                }}
              >
                Delete
              </div>
            </div>
          </div>
        );
      })}

      <AddNode
        activeNode={activeNode}
        setActiveNode={setActiveNode}
        book_id={book_id}
        setBookNodes={setBookNodes}
        bookNodes={bookNodes}
      />
    </div>
  );
}
