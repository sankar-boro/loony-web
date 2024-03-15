import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import AddNode from './AddNode';
import { orderBlogNodes } from 'loony-utils';

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

  if (!bookNodes) return null;

  return (
    <div className='con-75'>
      {bookNodes.map((book_node) => {
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
          </div>
        );
      })}

      <AddNode activeNode={activeNode} setActiveNode={setActiveNode} book_id={book_id} />
    </div>
  );
}
