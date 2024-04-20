import { useEffect, useState } from 'react';
import { axiosInstance } from './query';
import { useNavigate } from './Router';

const Home = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [books, setBooks] = useState([]);

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
        <div className='flex-row'>
          {blogs.map((blog) => {
            const images = blog.images ? JSON.parse(blog.images) : [];
            const image = images.length > 0 ? images[0] : null;
            return (
              <div className='card' key={blog.blog_id}>
                <div
                  className='card-image'
                  style={{
                    backgroundImage: image
                      ? `url("http://localhost:5002/api/i/${image.name}")`
                      : null,
                    overflow: 'hidden',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                  }}
                  onClick={() => {
                    navigate(`/view?blog_id=${blog.blog_id}`, blog);
                  }}
                />
                <div className='card-body'>
                  <div
                    className='card-title cursor'
                    onClick={() => {
                      navigate(`/view?blog_id=${blog.blog_id}`, blog);
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
        <div className='flex-row'>
          {books.map((book) => {
            const image = JSON.parse(book.images)[0];
            return (
              <div className='card' key={book.book_id}>
                <div className='card-image'>
                  {image && (
                    <img src={`http://localhost:5002/api/i/${image.name}`} height='100%' alt='' />
                  )}
                </div>
                <div className='card-body'>
                  <div
                    className='card-title cursor'
                    onClick={() => {
                      navigate(`/view?book_id=${book.book_id}`, book);
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
    </div>
  );
};

export default Home;
