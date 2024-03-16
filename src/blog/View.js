import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from '../Router';
import { axiosInstance } from '../query';
import { orderBlogNodes } from 'loony-utils';

const View = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(null);
  const [books, setBooks] = useState(null);

  const searchParams = new URLSearchParams(window.location.search);
  const blog_id = searchParams.get('blog_id');
  const book_id = searchParams.get('book_id');

  useEffect(() => {
    if (blog_id) {
      axiosInstance.get(`/blog/get_all_blog_nodes?blog_id=${blog_id}`).then(({ data }) => {
        setBlogs(orderBlogNodes(data.data));
      });
    }

    if (book_id) {
      axiosInstance.get(`/book/get_all_book_nodes?book_id=${book_id}`).then(({ data }) => {
        setBooks(orderBlogNodes(data.data));
      });
    }
  }, [blog_id, book_id]);

  const mainNode = (blogs && blogs[0]) || (books && books[0]);
  const navigateEdit = () => {
    navigate(`/edit?${blog_id ? 'blog_id' : 'book_id'}=${blog_id ? blog_id : book_id}`, mainNode);
  };
  if (!blogs && !books) return null;

  return (
    <div className='con-75'>
      <div className='page-heading flex-row'>
        <div style={{ width: '90%' }}>{mainNode.title}</div>
        <div style={{ width: '10%', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={navigateEdit}>Edit</button>
        </div>
      </div>
      <Markdown>{mainNode.body}</Markdown>
      {((blogs && blogs) || (books && books)).slice(1).map((blog_node) => {
        return (
          <div className='page-section' key={blog_node.uid}>
            <div className='section-title'>{blog_node.title}</div>
            <Markdown>{blog_node.body}</Markdown>
          </div>
        );
      })}
    </div>
  );
};

export default View;
