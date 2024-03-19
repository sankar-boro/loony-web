import BlogView from './blog/View';
import BookView from './book/View';

const View = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const blog_id = searchParams.get('blog_id');
  const book_id = searchParams.get('book_id');

  if (blog_id) {
    return <BlogView blog_id={blog_id} />;
  }

  if (book_id) {
    return <BookView book_id={book_id} />;
  }
};

export default View;
