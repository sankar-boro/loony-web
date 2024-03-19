import CreateBook from './book/Create';
import CreateBlog from './blog/Create';

export default function Create() {
  const searchParams = new URLSearchParams(window.location.search);
  const name = searchParams.get('name');

  if (name === 'blog') {
    return <CreateBlog />;
  }

  if (name === 'book') {
    return <CreateBook />;
  }
}
