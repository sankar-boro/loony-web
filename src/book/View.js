import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from '../Router';
import { axiosInstance } from '../query';
import { extractImage, orderBookNodes } from 'loony-utils';

const View = ({ book_id }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState(null);
  const [page_id, setPageId] = useState('');
  const [mainNode, setMainNode] = useState(null);
  const [nav_id, setNavId] = useState(null);
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
          setNavId(mainNode_.uid);
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

  const image = extractImage(mainNode.images);

  return (
    <div className='book-container'>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
          {(books && books).map((book_node) => {
            return (
              <div key={book_node.uid}>
                <div className='chapter-nav'>
                  <div
                    className='book-nav-title'
                    onClick={(e) => {
                      e.stopPropagation();
                      setMainNode(book_node);
                      setNavId(book_node.uid);
                      // setChildNodes(book_node.child);
                    }}
                  >
                    {book_node.title}
                  </div>
                </div>
                {nav_id === book_node.uid &&
                  book_node.child.map((section) => {
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
        <div
          style={{
            width: '60%',
            paddingTop: 15,
            paddingLeft: '5%',
            paddingRight: '5%',
            background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
          }}
        >
          <div>
            <div className='page-heading'>{mainNode.title}</div>
            {image ? (
              <div style={{ width: '50%', border: '1px solid #ccc', borderRadius: 5 }}>
                <img src={`http://localhost:5002/api/i/${image.name}`} alt='' width='100%' />
              </div>
            ) : null}
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
        <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            <li onClick={navigateEdit}>Edit this page</li>
            <li>Report</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default View;
