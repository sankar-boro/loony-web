import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useHistory, useNavigate } from '../Router';
import { axiosInstance } from '../query';
import { orderBlogNodes } from '../utils';

const View = () => {
  const { state } = useHistory();
  const navigate = useNavigate();
  const [books, setBooks] = useState(null);
  useEffect(() => {
    axiosInstance.get(`/book/get_all_book_nodes?book_id=${state.book_id}`).then(({ data }) => {
      setBooks(orderBlogNodes(data.data));
    });
  }, [state.book_id]);

  const navigateEdit = () => {
    navigate('/edit_book', state);
  };

  if (!books) return null;

  return (
    <div>
      <div className='page-title'>{state.title}</div>
      <Markdown>{state.body}</Markdown>
      {books.map((book_node) => {
        return (
          <div key={book_node.uid}>
            <div>{book_node.title}</div>
            <div>{book_node.body}</div>
          </div>
        );
      })}

      <button onClick={navigateEdit}>Edit</button>
    </div>
  );
};

export default View;
