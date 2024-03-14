import { useEffect, useState } from 'react';
import { axiosInstance } from '../query';
import { useNavigate } from '../Router';

const Home = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  useEffect(() => {
    axiosInstance.get('/book/get_all_books').then(({ data }) => {
      setBooks(data.data);
    });
  }, []);

  return (
    <div className='con-75'>
      <div className='app-body'>
        <div className='flex-row'>
          {books.map((book) => {
            return (
              <div className='card' key={book.book_id}>
                <div className='card-image' />
                <div className='card-body'>
                  <div
                    className='card-title cursor'
                    onClick={() => {
                      navigate('/view_book', book);
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
