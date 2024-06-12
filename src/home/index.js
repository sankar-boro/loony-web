import { useEffect, useState } from 'react';
import { axiosInstance } from '../utils/query';
import { useNavigate } from 'react-router-dom';
import CardLoader from '../components/CardLoader';

const Home = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState(null);
  const [books, setBooks] = useState(null);

  useEffect(() => {
    axiosInstance.get('/blog/get_all_blogs').then(({ data }) => {
      setBlogs(data.data);
    });
    axiosInstance.get('/book/get_all_books').then(({ data }) => {
      setBooks(data.data);
    });
  }, []);

  return (
    <div className='book-container'>
      <div className='app-body'>
        <h3>Blogs</h3>
        <div className='flex-row' style={{ flexWrap: 'wrap' }}>
          {!blogs
            ? [1, 2, 3, 4].map((key) => {
                return <CardLoader key={key} />;
              })
            : null}
          {blogs &&
            blogs.map((blog) => {
              const images = blog.images ? JSON.parse(blog.images) : [];
              const image = images.length > 0 ? images[0] : null;
              return (
                <div className='card' key={blog.blog_id}>
                  <div
                    className='card-image'
                    style={{
                      backgroundImage:
                        image && image.name
                          ? `url("${process.env.REACT_APP_BASE_API_URL}/api/g/${blog.blog_id}/340/${image.name}")`
                          : null,
                      overflow: 'hidden',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                    }}
                    onClick={() => {
                      navigate(`/view/blog/${blog.blog_id}`, blog);
                    }}
                  />
                  <div className='card-body'>
                    <div
                      className='card-title cursor'
                      onClick={() => {
                        navigate(`/view/blog/${blog.blog_id}`, blog);
                      }}
                    >
                      {blog.title}
                    </div>
                    <div className='card-body' />
                  </div>
                </div>
              );
            })}
        </div>
        <h3>Books</h3>
        <div className='flex-row' style={{ flexWrap: 'wrap' }}>
          {!books
            ? [5, 6, 7, 8].map((key) => {
                return <CardLoader key={key} />;
              })
            : null}
          {books &&
            books.map((book) => {
              const image = JSON.parse(book.images)[0];
              return (
                <div className='card' key={book.book_id}>
                  <div
                    className='card-image'
                    style={{
                      backgroundImage:
                        image && image.name
                          ? `url("${process.env.REACT_APP_BASE_API_URL}/api/g/${book.book_id}/340/${image.name}")`
                          : null,
                      overflow: 'hidden',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                    }}
                    onClick={() => {
                      navigate(`/view/book/${book.book_id}`, book);
                    }}
                  />
                  <div className='card-body'>
                    <div
                      className='card-title cursor'
                      onClick={() => {
                        navigate(`/view/book/${book.book_id}`, book);
                      }}
                    >
                      {book.title}
                    </div>
                    <div className='card-body' />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div style={{ height: 50 }} />
    </div>
  );
};

export default Home;
