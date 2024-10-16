import { axiosInstance } from 'loony-query';
import { orderBlogNodes } from 'loony-utils';
import { ApiEvent } from 'loony-types';
import { ApiDispatchAction, EditAction, ReadAction } from 'loony-types';

export const getNodes = (blog_id: number, setState: EditAction | ReadAction, setStatus: ApiDispatchAction) => {
  const url = `/blog/get/nodes?blog_id=${blog_id}`;
  setStatus((prevState) => ({
    ...prevState,
    status: ApiEvent.INIT,
  }));
  axiosInstance.get(url).then(({ data }) => {
    const __rawNodes = [data.blog, ...data.nodes];
    const __blogNodes = orderBlogNodes(__rawNodes);
    const __mainNode = __blogNodes && __blogNodes[0];
    const __childNodes = __blogNodes.slice(1);

    setState((prevState: any) => ({
      ...prevState,
      doc_info: data.blog,
      mainNode: __mainNode,
      childNodes: __childNodes,
      blogNodes: __blogNodes,
      rawNodes: __rawNodes,
    }));
    setStatus((prevState) => ({
      ...prevState,
      status: ApiEvent.IDLE,
    }));
  });
};
