import { axiosInstance } from "loony-query";
import { orderBlogNodes } from "loony-utils";

export const getNodes = (blog_id, setState, setStatus) => {
  const url = `/blog/get/nodes?blog_id=${blog_id}`;
  setStatus((prevState) => ({
    ...prevState,
    status: "INIT",
  }));
  axiosInstance.get(url).then(({ data }) => {
    const __rawNodes = data.nodes;
    const __blogNodes = orderBlogNodes(data.nodes);
    const __mainNode = __blogNodes && __blogNodes[0];
    const __childNodes = __blogNodes.slice(1);

    setState((prevState) => ({
      ...prevState,
      blog_info: data.blog,
      mainNode: __mainNode,
      childNodes: __childNodes,
      blogNodes: __blogNodes,
      rawNodes: __rawNodes,
    }));
    setStatus((prevState) => ({
      ...prevState,
      status: "",
    }));
  });
};
