import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useHistory } from '../Router';
import { axiosInstance } from '../query';
import AddNode from './AddNode';

export default function Edit() {
  const { state } = useHistory();

  const [bookNodes, setBookNodes] = useState(null);
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/book/get_all_book_nodes?book_id=${state.book_id}`).then(({ data }) => {
      setBookNodes(data.data);
    });
  }, [state.book_id]);

  if (!bookNodes) return null;

  return (
    <div>
      {bookNodes.map((book_node) => {
        return (
          <div key={book_node.uid}>
            <div>{book_node.title}</div>
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

      <AddNode activeNode={activeNode} setActiveNode={setActiveNode} book_id={state.book_id} />
    </div>
  );
}
