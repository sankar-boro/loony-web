import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { axiosInstance } from '../query';
import AddNode from './AddNode';
import { orderBlogNodes, deleteBlogNode } from 'loony-utils';

export default function Edit() {
  const [blogNodes, setBlogNodes] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const blog_id = searchParams.get('blog_id');
  useEffect(() => {
    axiosInstance.get(`/blog/get_all_blog_nodes?blog_id=${blog_id}`).then(({ data }) => {
      setBlogNodes(orderBlogNodes(data.data));
    });
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
  if (!blogNodes) return null;

  return (
    <div className='con-75'>
      {blogNodes.map((blog_node, node_index) => {
        return (
          <div key={blog_node.uid}>
            <div className='section-title'>{blog_node.title}</div>
            <Markdown>{blog_node.body}</Markdown>
            <button
              onClick={() => {
                setActiveNode(blog_node);
              }}
            >
              Add Node
            </button>
            <button
              onClick={() => {
                deleteNode(blog_node, node_index);
              }}
            >
              Delete
            </button>
          </div>
        );
      })}

      <AddNode
        activeNode={activeNode}
        setActiveNode={setActiveNode}
        blog_id={blog_id}
        setBlogNodes={setBlogNodes}
        blogNodes={blogNodes}
      />
    </div>
  );
}
