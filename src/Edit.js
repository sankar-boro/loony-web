import EditBook from './book/Edit';
import EditBlog from './blog/Edit';

export default function Edit() {
  const searchParams = new URLSearchParams(window.location.search);
  const name = searchParams.get('name');

  if (name === 'blog') {
    const blog_id = searchParams.get('blog_id');

    return <EditBlog blog_id={blog_id} />;
  }

  if (name === 'book') {
    const book_id = searchParams.get('book_id');
    return <EditBook book_id={book_id} />;
  }
}
