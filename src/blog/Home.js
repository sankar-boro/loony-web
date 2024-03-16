import { useEffect, useState } from 'react';
import { axiosInstance } from '../query';
import { useNavigate } from '../Router';

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
    <div className='con-75'>
      <div className='app-body'>
        <div className='flex-row'>
          {blogs.map((blog) => {
            return (
              <div className='card' key={blog.blog_id}>
                <div className='card-image' />
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

        <div className='flex-row'>
          {books.map((book) => {
            return (
              <div className='card' key={book.book_id}>
                <div className='card-image' />
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
