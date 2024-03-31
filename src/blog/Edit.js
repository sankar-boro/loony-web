import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import AddNode from './AddNode';
import { orderBlogNodes, deleteBlogNode } from 'loony-utils';
import { useHistory } from '../Router';
import EditNode from './EditNode';

export default function Edit({ blog_id }) {
  const { goBack, replaceState } = useHistory();
  const [rawNodes, setRawNodes] = useState([]);
  const [blogNodes, setBlogNodes] = useState(null);
  const [activity, setActivity] = useState({
    modal: '',
    mainNode: null,
    activeNode: null,
  });

  useEffect(() => {
    if (blog_id) {
      axiosInstance.get(`/blog/get_all_blog_nodes?blog_id=${blog_id}`).then(({ data }) => {
        setRawNodes(data.data);
        setBlogNodes(orderBlogNodes(data.data));
      });
    }
  }, [blog_id]);

  const deleteNode = (delete_node, delete_node_index) => {
    if (blogNodes) {
      const updateNode = blogNodes[delete_node_index + 1] || null;
      const submitData = {
        update_parent_id: delete_node.parent_id,
        delete_node_id: delete_node.uid,
        update_node_id: updateNode ? updateNode.uid : null,
      };
      axiosInstance
        .post(`/blog/delete_blog_node`, submitData)
        .then(() => {
          setBlogNodes(deleteBlogNode(blogNodes, submitData, delete_node_index));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteBlog = () => {
    axiosInstance
      .post(`/blog/delete_blog`, { blog_id: parseInt(blog_id) })
      .then(() => {
        replaceState({}, null, '/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!blogNodes) return null;

  return (
    <div className='book-container'>
      <div>
        <div onClick={goBack} className='button-none' style={{ marginBottom: 16 }}>
          Back
        </div>
        <div onClick={deleteBlog}>Delete</div>
      </div>
      {blogNodes.map((blog_node, node_index) => {
        return (
          <div style={{ marginBottom: 16 }} key={blog_node.uid}>
            <div className='section-title'>{blog_node.title}</div>
            <Markdown>{blog_node.body}</Markdown>
            <div className='flex-row'>
              <div
                className='button-none cursor'
                onClick={() => {
                  setActivity({
                    ...activity,
                    modal: 'add_node',
                    activeNode: blog_node,
                  });
                }}
                style={{ marginRight: 16 }}
              >
                Add
              </div>
              <div
                className='button-none cursor'
                onClick={() => {
                  setActivity({
                    ...activity,
                    modal: 'edit_node',
                    activeNode: blog_node,
                  });
                }}
                style={{ marginRight: 16 }}
              >
                Edit
              </div>
              <div
                className='delete-button-none cursor'
                onClick={() => {
                  deleteNode(blog_node, node_index);
                }}
              >
                Delete
              </div>
            </div>
          </div>
        );
      })}

      {activity.modal === 'add_node' ? (
        <AddNode
          activeNode={activity.activeNode}
          setActivity={setActivity}
          blog_id={blog_id}
          setBlogNodes={setBlogNodes}
          blogNodes={blogNodes}
          rawNodes={rawNodes}
          setRawNodes={setRawNodes}
        />
      ) : null}

      {activity.modal === 'edit_node' ? (
        <EditNode
          activeNode={activity.activeNode}
          setActivity={setActivity}
          blog_id={blog_id}
          setBlogNodes={setBlogNodes}
          blogNodes={blogNodes}
          rawNodes={rawNodes}
          setRawNodes={setRawNodes}
        />
      ) : null}
    </div>
  );
}
