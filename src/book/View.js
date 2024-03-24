import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from '../Router';
import { axiosInstance } from '../query';
import { orderBookNodes } from 'loony-utils';

const View = ({ book_id }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState(null);
  const [page_id, setPageId] = useState('');
  const [mainNode, setMainNode] = useState(null);

  useEffect(() => {
    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        const books_ = orderBookNodes(data.data);
        const mainNode_ = books_ && books_[0];
        if (mainNode_) {
          setBooks(books_);
          setMainNode(mainNode_);
          setPageId(mainNode_.uid);
        }
      });
    }
  }, []);

  const navigateEdit = () => {
    navigate(`/edit?name=book&book_id=${book_id}`, mainNode);
  };

  if (!books) return null;
  if (!page_id) return null;
  return (
    <div className='con-75'>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '20%' }}>
          {(books && books).map((book_node) => {
            return (
              <div className='page-section' key={book_node.uid}>
                <div
                  className='book-nav-title'
                  onClick={() => {
                    setPageId(book_node.uid);
                  }}
                >
                  {book_node.title}
                </div>
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
          {(books && books).map((book_node) => {
            if (book_node.page_id === page_id) {
              return (
                <div className='page-section' key={book_node.uid}>
                  <div className='section-title'>{book_node.title}</div>
                  <Markdown>{book_node.body}</Markdown>
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
