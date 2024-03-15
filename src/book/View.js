import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from '../Router';
import { axiosInstance } from '../query';
import { orderBlogNodes } from 'loony-utils';

const View = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState(null);

  const searchParams = new URLSearchParams(window.location.search);
  const book_id = searchParams.get('book_id');
  useEffect(() => {
    axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
      setBooks(orderBlogNodes(data.data));
    });
  }, [book_id]);

  const mainNode = books && books[0];
  const navigateEdit = () => {
    navigate(`/edit?book_id=${book_id}`, mainNode);
  };
  if (!books) return null;
  return (
    <div className='con-75'>
      <div className='page-heading'>{mainNode.title}</div>
      <Markdown>{mainNode.body}</Markdown>
      {books.slice(1).map((book_node) => {
        return (
          <div className='page-section' key={book_node.uid}>
            <div className='section-title'>{book_node.title}</div>
            <Markdown>{book_node.body}</Markdown>
          </div>
        );
      })}

      <button onClick={navigateEdit}>Edit</button>
    </div>
  );
};

export default View;
