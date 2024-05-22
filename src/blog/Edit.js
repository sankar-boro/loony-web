import MarkdownPreview from '@uiw/react-markdown-preview';

import { useState, useEffect } from 'react';
import { orderBlogNodes, deleteBlogNode, extractImage } from 'loony-utils';
import { RxReader } from 'react-icons/rx';
import { AiOutlineDelete } from 'react-icons/ai';
import { LuFileWarning } from 'react-icons/lu';
import { MdAdd } from 'react-icons/md';
import { FiEdit2 } from 'react-icons/fi';
import { useParams, Link } from 'react-router-dom';

import { axiosInstance } from '../utils/query';
import AddNode from './AddNode';
import EditNode from './EditNode';
import ConfirmAction from './ConfirmAction';

export default function Edit() {
  const { blogId } = useParams();
  const blog_id = parseInt(blogId);
  const [rawNodes, setRawNodes] = useState([]);
  const [blogNodes, setBlogNodes] = useState(null);
  const [activity, setActivity] = useState({
    modal: '',
    page_id: null,
    mainNode: null,
    activeNode: null,
    node_index: null,
  });
  const [mainNode, setMainNode] = useState(null);
  const [childNodes, setChildNodes] = useState([]);

  useEffect(() => {
    if (blog_id) {
      axiosInstance.get(`/blog/get_all_blog_nodes?blog_id=${blog_id}`).then(({ data }) => {
        setRawNodes(data.data);
        const blogs_ = orderBlogNodes(data.data);
        const mainNode_ = blogs_ && blogs_[0];
        const childNodes_ = blogs_.slice(1);

        if (mainNode_) {
          setMainNode(mainNode_);
          setChildNodes(childNodes_);
          setBlogNodes(blogs_);
        }
      });
    }
  }, [blog_id]);

  const deleteNode = () => {
    const delete_node = activity.activeNode;
    if (childNodes) {
      let updateNode = null;
      rawNodes.forEach((r) => {
        if (r.parent_id === delete_node.uid) {
          updateNode = r;
        }
      });

      const submitData = {
        page_id: activity.page_id,
        identity: delete_node.identity,
        update_parent_id: delete_node.parent_id,
        delete_node_id: delete_node.uid,
        update_node_id: updateNode ? updateNode.uid : null,
      };
      axiosInstance
        .post(`/blog/delete_blog_node`, submitData)
        .then(() => {
          const newNodes = deleteBlogNode(rawNodes, submitData, activity.node_index);
          setRawNodes(newNodes);
          const blogs_ = orderBlogNodes(newNodes);
          const mainNode_ = blogs_ && blogs_[0];
          const childNodes_ = blogs_.slice(1);

          if (mainNode_) {
            setMainNode(mainNode_);
            setChildNodes(childNodes_);
            setBlogNodes(blogs_);
            setActivity({
              ...activity,
              mainNode: mainNode_,
              page_id: mainNode_.uid,
              modal: '',
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteBlog = () => {
    axiosInstance.post('/blog/delete_blog', { blog_id: parseInt(blog_id) }).then(() => {});
  };

  if (!blogNodes) return null;
  const image = extractImage(mainNode.images);

  return (
    <div className='book-container'>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        <div style={{ width: '20%', paddingTop: 15, borderRight: '1px solid #ebebeb' }}>
          {blogNodes.map((chapter) => {
            return (
              <div className='chapter-nav-con cursor' key={chapter.uid}>
                <div
                  className='chapter-nav'
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {chapter.title}
                </div>
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
                  src={`${process.env.REACT_APP_BASE_API_URL}/api/i/${image.name}`}
                  alt=''
                  width='100%'
                />
              </div>
            ) : null}
            <MarkdownPreview
              source={mainNode.body}
              wrapperElement={{ 'data-color-mode': 'light' }}
            />
          </div>
          <div className='flex-row'>
            <div
              className='button-none cursor'
              onClick={() => {
                setActivity({
                  ...activity,
                  activeNode: mainNode,
                  modal: 'add_node',
                });
              }}
              style={{ marginRight: 10 }}
            >
              <div className='btn-action'>
                <MdAdd size={16} color='#9c9c9c' />
              </div>
            </div>
            <div
              className='button-none cursor'
              onClick={() => {
                setActivity({
                  ...activity,
                  activeNode: mainNode,
                  modal: 'delete_blog',
                });
              }}
            >
              <div className='btn-action'>
                <AiOutlineDelete size={16} color='#9c9c9c' />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            {mainNode.identity !== 101 &&
              childNodes.map((node, node_index) => {
                return (
                  <div style={{ marginBottom: 50, marginTop: 50 }} key={node.uid}>
                    <div className='section-title'>{node.title}</div>
                    <MarkdownPreview
                      source={node.body}
                      wrapperElement={{ 'data-color-mode': 'light' }}
                    />
                    <div className='flex-row'>
                      <div
                        className='button-none cursor'
                        onClick={() => {
                          setActivity({
                            ...activity,
                            activeNode: node,
                            page_id: mainNode.uid,
                            modal: 'add_node',
                          });
                        }}
                        style={{ marginRight: 16 }}
                      >
                        <div className='btn-action'>
                          <MdAdd size={16} color='#9c9c9c' />
                        </div>
                      </div>
                      <div
                        className='button-none cursor'
                        onClick={() => {
                          setActivity({
                            ...activity,
                            activeNode: node,
                            page_id: node.uid,
                            modal: 'edit_node',
                          });
                        }}
                        style={{ marginRight: 16 }}
                      >
                        <div className='btn-action'>
                          <FiEdit2 size={16} color='#9c9c9c' />
                        </div>
                      </div>
                      <div
                        className='delete-button-none cursor'
                        onClick={() => {
                          setActivity({
                            ...activity,
                            activeNode: node,
                            node_index,
                            modal: 'delete_node',
                          });
                        }}
                      >
                        <div className='btn-action'>
                          <AiOutlineDelete size={16} color='#9c9c9c' />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div style={{ width: '20%', paddingLeft: 15, paddingTop: 15 }}>
          <ul style={{ paddingLeft: 0, listStyle: 'none' }} className='list-item'>
            <li onClick={() => {}}>
              <RxReader size={16} color='#2d2d2d' />{' '}
              <Link
                to={`/view/book/${blog_id}`}
                style={{ color: 'rgb(15, 107, 228)', marginLeft: 5 }}
              >
                Read Blog
              </Link>
            </li>

            <li
              onClick={() => {
                setActivity({
                  ...activity,
                  modal: 'delete_blog',
                });
              }}
            >
              <AiOutlineDelete size={16} color='#2d2d2d' /> Delete Blog
            </li>
            <li>
              <LuFileWarning size={16} color='#2d2d2d' /> Report
            </li>
          </ul>
          <div style={{ borderTop: '1px solid #ccc', marginTop: 5, paddingTop: 5 }}>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              <li
                onClick={() => {
                  setActivity({
                    ...activity,
                    activeNode: mainNode,
                    page_id: mainNode.uid,
                    modal: 'edit_node',
                  });
                }}
              >
                {mainNode.title}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {activity.modal === 'add_node' ? (
        <AddNode
          activeNode={activity.activeNode}
          setActivity={setActivity}
          blog_id={blog_id}
          setBlogNodes={setBlogNodes}
          setRawNodes={setRawNodes}
          setMainNode={setMainNode}
          setChildNodes={setChildNodes}
          rawNodes={rawNodes}
          blogNodes={blogNodes}
          page_id={activity.page_id}
        />
      ) : null}
      {activity.modal === 'delete_node' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Node?'
          confirmAction={deleteNode}
          title='Delete Book'
          onClose={() => {
            setActivity({ ...activity, modal: '' });
          }}
        />
      ) : null}

      {activity.modal === 'edit_node' ? (
        <EditNode
          activeNode={activity.activeNode}
          setActivity={setActivity}
          blog_id={blog_id}
          setBlogNodes={setBlogNodes}
          setRawNodes={setRawNodes}
          setMainNode={setMainNode}
          setChildNodes={setChildNodes}
          rawNodes={rawNodes}
          blogNodes={blogNodes}
          page_id={activity.page_id}
        />
      ) : null}

      {activity.modal === 'delete_blog' ? (
        <ConfirmAction
          confirmTitle='Are you sure you want to delete Blog?'
          confirmAction={deleteBlog}
          title='Delete Blog'
          onClose={() => {
            setActivity({ ...activity, modal: '' });
          }}
        />
      ) : null}
    </div>
  );
}
