import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import { axiosInstance } from '../query';
import { extractImage, orderBlogNodes } from 'loony-utils';
import { LuFileWarning } from 'react-icons/lu';
import { LuFileEdit } from 'react-icons/lu';

const View = () => {
  const { blogId } = useParams();
  const blog_id = parseInt(blogId);
  const [blogs, setBlogs] = useState(null);
  const [page_id, setPageId] = useState('');
  const [mainNode, setMainNode] = useState(null);
  const [childNodes, setChildNodes] = useState([]);

  useEffect(() => {
    if (blog_id) {
      axiosInstance.get(`/blog/get_all_blog_nodes?blog_id=${blog_id}`).then(({ data }) => {
        const blogs_ = orderBlogNodes(data.data);
        const mainNode_ = blogs_ && blogs_[0];
        const childNodes_ = blogs_.slice(1);
        if (mainNode_) {
          setBlogs(blogs_);
          setMainNode(mainNode_);
          setChildNodes(childNodes_);
          setPageId(mainNode_.uid);
        }
      });
    }
  }, [blog_id]);

  if (!blogs) return null;
  if (!page_id) return null;
  const image = extractImage(mainNode.images);

  return (
    <div className='book-container'>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
          {(blogs && blogs).map((blog_node) => {
            return (
              <div className='chapter-nav-con' key={blog_node.uid}>
                <div className='chapter-nav'>{blog_node.title}</div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            width: '60%',
            paddingTop: 15,
            paddingLeft: '5%',
            paddingRight: '5%',
            background: 'linear-gradient(to right, #ffffff, #F6F8FC)',
          }}
        >
          <div>
            <div className='page-heading'>{mainNode.title}</div>
            {image && image.name ? (
              <div style={{ width: '50%', border: '1px solid #ccc', borderRadius: 5 }}>
                <img
                  src={`${process.env.REACT_APP_BASE_URL}/api/i/${image.name}`}
                  alt=''
                  width='100%'
                />
              </div>
            ) : null}
            <Markdown>{mainNode.body}</Markdown>
          </div>
          {childNodes.map((blog_node) => {
            return (
              <div className='page-section' key={blog_node.uid}>
                <div className='section-title'>{blog_node.title}</div>
                <Markdown>{blog_node.body}</Markdown>
              </div>
            );
          })}
        </div>
        <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
          <ul style={{ paddingLeft: 0, listStyle: 'none' }} className='list-item'>
            <li>
              <LuFileEdit color='#2d2d2d' size={16} />

              <Link
                to={`/edit/blog/${blog_id}`}
                style={{ color: 'rgb(15, 107, 228)', marginLeft: 5 }}
              >
                Edit this page
              </Link>
            </li>
            <li>
              <LuFileWarning color='#2d2d2d' size={16} /> Report
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default View;
