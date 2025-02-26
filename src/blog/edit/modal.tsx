/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from "react";
import { deleteBlogNode, orderBlogChildNodes } from "loony-utils";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "loony-api";
import ConfirmAction from "../../components/ConfirmAction.tsx";
import { EditBlogState } from "loony-types";
import { DocNode } from "loony-types";

export default function EditModal({
  state,
  blog_id,
  setState,
}: {
  state: EditBlogState;
  blog_id: number;
  setState: React.Dispatch<React.SetStateAction<EditBlogState>>;
}) {
  const navigate = useNavigate();
  const { childNodes, modal } = state;
  const { mainNode } = state;

  const deleteBlog = useCallback(() => {
    axiosInstance.post("/blog/delete", { blog_id }).then(() => {
      navigate("/", { replace: true });
    });
  }, [navigate, blog_id]);

  const onCancel = useCallback(() => {
    setState({
      ...state,
      modal: "",
      editNode: null,
      addNode: null,
    });
  }, [setState, state]);

  if (!mainNode || !mainNode) return null;

  const onDeleteNode = () => {
    if (!state.deleteNode) return;
    const delete_node = state.deleteNode;
    if (childNodes) {
      let updateNode: DocNode | undefined;
      childNodes.forEach((r) => {
        if (r.parent_id === delete_node.uid) {
          updateNode = r;
        }
      });

      const submitData = {
        delete_node: {
          identity: delete_node.identity,
          uid: delete_node.uid,
        },
        update_node: updateNode
          ? {
              parent_id: delete_node.parent_id,
              uid: updateNode ? updateNode.uid : null,
            }
          : null,
      };

      axiosInstance
        .post(`/blog/delete/node`, submitData)
        .then(() => {
          const nodesAfterDelete = deleteBlogNode(childNodes, submitData);
          const orderChildNodes = orderBlogChildNodes(
            nodesAfterDelete,
            mainNode
          );

          setState({
            ...state,
            childNodes: orderChildNodes,
            form: "",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {modal === "delete_node" && state.deleteNode ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Node?"
          confirmAction={onDeleteNode}
          title="Delete Node"
          onCancel={onCancel}
        />
      ) : null}
      {modal === "delete_blog" ? (
        <ConfirmAction
          confirmTitle="Are you sure you want to delete Blog?"
          confirmAction={deleteBlog}
          title="Delete Blog"
          onCancel={onCancel}
        />
      ) : null}
    </>
  );
}
