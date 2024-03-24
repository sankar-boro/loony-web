import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from '../Router';
import { axiosInstance } from '../query';
import { orderBlogNodes } from 'loony-utils';

const View = ({ book_id }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState(null);
  const [page_id, setPageId] = useState('');
  const [mainNode, setMainNode] = useState(null);

  useEffect(() => {
    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        setBooks(orderBlogNodes(data.data));
        const mainNode_ = books && books[0];
        if (mainNode_) {
          setMainNode(mainNode_);
          setPageId(mainNode_.uid);
        }
      });
    }
  }, [book_id, books]);

  const navigateEdit = () => {
    navigate(`/edit?name=book&book_id=${book_id}`, mainNode);
  };
  if (!books) return null;

  return (
    <div className='con-75'>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '20%' }}>
          {(books && books).map((blog_node) => {
            return (
              <div className='page-section' key={blog_node.uid}>
                <div className='book-nav-title'>{blog_node.title}</div>
              </div>
            );
          })}
        </div>
        <div style={{ width: '80%' }}>
          <div className='page-heading flex-row'>
            <div style={{ width: '90%' }}>{mainNode.title}</div>
            <div style={{ width: '10%', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={navigateEdit}>Edit</button>
            </div>
          </div>
          <Markdown>{mainNode.body}</Markdown>
          {(books && books).slice(1).map((blog_node) => {
            if (blog_node.page_id === page_id) {
              return (
                <div className='page-section' key={blog_node.uid}>
                  <div className='section-title'>{blog_node.title}</div>
                  <Markdown>{blog_node.body}</Markdown>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default View;
