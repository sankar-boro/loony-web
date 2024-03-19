import EditBook from './book/Edit';
import EditBlog from './blog/Edit';

export default function Edit() {
  const searchParams = new URLSearchParams(window.location.search);
  const name = searchParams.get('name');

  if (name === 'blog') {
    return <EditBlog />;
  }

  if (name === 'book') {
    return <EditBook />;
  }
}
