import { useEffect, useState } from 'react';
import { axiosInstance } from 'loony-query';
import { useNavigate } from 'react-router-dom';
import CardLoader from '../components/CardLoader';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='book-container'>
      <div className='app-body'>
        <Blogs navigate={navigate} />
        <Books navigate={navigate} />
      </div>
      <div style={{ height: 50 }} />
    </div>
  );
};

const Blogs = ({ navigate }) => {
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    axiosInstance.get('/blog/get_all_blogs').then(({ data }) => {
      setBlogs(data.data);
    });
  }, []);
  return (
    <>
      <h3>Blogs</h3>
      <div className='flex-row' style={{ flexWrap: 'wrap' }}>
        {!blogs
          ? [1, 2, 3, 4].map((key) => {
              return <CardLoader key={key} />;
            })
          : null}
        {blogs &&
          blogs.map((node) => {
            return (
              <Card
                key={node.blog_id}
                node={node}
                navigate={navigate}
                nodeType='blog'
                nodeIdType='blog_id'
              />
            );
          })}
      </div>
    </>
  );
};

const Books = ({ navigate }) => {
  const [books, setBooks] = useState(null);
  useEffect(() => {
    axiosInstance.get('/book/get_all_books').then(({ data }) => {
      setBooks(data.data);
    });
  }, []);

  return (
    <>
      <h3>Books</h3>
      <div className='flex-row' style={{ flexWrap: 'wrap' }}>
        {!books
          ? [5, 6, 7, 8].map((key) => {
              return <CardLoader key={key} />;
            })
          : null}
        {books &&
          books.map((node) => {
            return (
              <Card
                key={node.book_id}
                node={node}
                navigate={navigate}
                nodeType='book'
                nodeIdType='book_id'
              />
            );
          })}
      </div>
    </>
  );
};

const Card = ({ node, navigate, nodeType, nodeIdType }) => {
  const image = JSON.parse(node.images)[0];

  return (
    <div className='card' key={node[nodeIdType]}>
      <div
        className='card-image'
        style={{
          backgroundImage:
            image && image.name
              ? `url("${process.env.REACT_APP_BASE_API_URL}/api/${nodeType}/${node[nodeIdType]}/340/${image.name}")`
              : null,
          overflow: 'hidden',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
        onClick={() => {
          navigate(`/view/${nodeType}/${node[nodeIdType]}`, node);
        }}
      />
      <div className='card-body'>
        <div
          className='card-title cursor'
          onClick={() => {
            navigate(`/view/${nodeType}/${node[nodeIdType]}`, node);
          }}
        >
          {node.title}
        </div>
        <div className='card-body' />
      </div>
    </div>
  );
};
export default Home;
