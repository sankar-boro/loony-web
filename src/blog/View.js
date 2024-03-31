import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useNavigate } from '../Router';
import { axiosInstance } from '../query';
import { orderBlogNodes } from 'loony-utils';

const View = ({ blog_id }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    if (blog_id) {
      axiosInstance.get(`/blog/get_all_blog_nodes?blog_id=${blog_id}`).then(({ data }) => {
        setBlogs(orderBlogNodes(data.data));
      });
    }
  }, [blog_id]);

  const mainNode = (blogs && blogs[0]) || null;
  const navigateEdit = () => {
    navigate(`/edit?name=blog&blog_id=${blog_id}`, mainNode);
  };
  if (!blogs) return null;
  const image = JSON.parse(mainNode.images)[0];

  return (
    <div className='con-75'>
      <div className='page-heading flex-row'>
        <div style={{ width: '90%' }}>{mainNode.title}</div>
        <div style={{ width: '10%', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={navigateEdit}>Edit</button>
        </div>
      </div>
      {image ? (
        <div style={{ width: '50%', border: '1px solid #ccc', borderRadius: 5 }}>
          <img src={`http://localhost:5002/api/i/${image.name}`} alt='' width='100%' />
        </div>
      ) : null}
      <Markdown>{mainNode.body}</Markdown>
      {(blogs && blogs).slice(1).map((blog_node) => {
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
