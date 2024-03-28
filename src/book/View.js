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
  const [childNodes, setChildNodes] = useState([]);

  useEffect(() => {
    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        const books_ = orderBookNodes(data.data);
        const mainNode_ = books_ && books_[0];
        const childNodes_ = mainNode_.child;
        if (mainNode_) {
          setBooks(books_);
          setMainNode(mainNode_);
          setChildNodes(childNodes_);
          setPageId(mainNode_.uid);
        }
      });
    }
  }, [book_id]);

  const navigateEdit = () => {
    navigate(`/edit?name=book&book_id=${book_id}`, mainNode);
  };

  if (!books) return null;
  if (!page_id) return null;

  const image = JSON.parse(mainNode.images)[0];
  return (
    <div className='con-75'>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '20%' }}>
          {(books && books).map((book_node) => {
            return (
              <div key={book_node.uid}>
                <div className='chapter-nav'>
                  <div
                    className='book-nav-title'
                    onClick={(e) => {
                      e.stopPropagation();
                      setMainNode(book_node);
                      setChildNodes(book_node.child);
                    }}
                  >
                    {book_node.title}
                  </div>
                </div>
                {book_node.child.map((section) => {
                  return (
                    <div
                      key={section.uid}
                      className='section-nav'
                      style={{ paddingLeft: 20 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainNode(section);
                        setChildNodes(section.child);
                      }}
                    >
                      {section.title}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div style={{ width: '80%' }}>
          <div>
            <div className='page-heading'>{mainNode.title}</div>
            {mainNode.identity === 100 ? (
              <div style={{ marginTop: 50 }}>
                <button onClick={navigateEdit}>Edit</button>
              </div>
            ) : null}
            <div style={{ width: '50%', border: '1px solid #ccc', borderRadius: 5 }}>
              <img src={`http://localhost:5002/api/i/${image.name}`} alt='' width='100%' />
            </div>
            <Markdown>{mainNode.body}</Markdown>
          </div>
          {childNodes.map((book_node) => {
            return (
              <div className='page-section' key={book_node.uid}>
                <div className='section-title'>{book_node.title}</div>
                <Markdown>{book_node.body}</Markdown>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default View;
