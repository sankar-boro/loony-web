import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from '../Router';
import { axiosInstance } from '../query';
import { orderBlogNodes } from 'loony-utils';

const View = ({ book_id }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState(null);

  useEffect(() => {
    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        setBooks(orderBlogNodes(data.data));
      });
    }
  }, [book_id]);

  const mainNode = books && books[0];
  const navigateEdit = () => {
    navigate(`/edit?book_id=${book_id}`, mainNode);
  };
  if (!books) return null;

  return (
    <div className='con-75'>
      <div className='page-heading flex-row'>
        <div style={{ width: '90%' }}>{mainNode.title}</div>
        <div style={{ width: '10%', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={navigateEdit}>Edit</button>
        </div>
      </div>
      <Markdown>{mainNode.body}</Markdown>
      {(books && books).slice(1).map((blog_node) => {
        return (
          <div className='page-section' key={blog_node.uid}>
            <div className='section-title'>{blog_node.title}</div>
            <Markdown>{blog_node.body}</Markdown>
          </div>
        );
      })}
    </div>
  );
};

export default View;
