export const orderBlogNodes = (data) => {
  const totalNodes = data.length;
  const nodesMap = new Map();
  const parentNodesMap = new Map();

  data.forEach((node) => nodesMap.set(node.uid, node));
  data.forEach((node) => node.parent_id && parentNodesMap.set(node.parent_id, node));

  const elements = [];
  let currentIndex = 0;
  let parentData = null;
  let found = false;

  while (!found) {
    if (!data[currentIndex].parent_id) {
      found = true;
      parentData = data[currentIndex];
      break;
    } else {
      currentIndex += 1;
    }
  }

  elements.push(parentData);
  while (elements.length !== totalNodes) {
    const cElement = parentNodesMap.get(parentData.uid);
    elements.push(cElement);
    parentData = cElement;
  }

  return elements;
};

export const parseUrl = (urlString) => {
  const url = new URL(urlString);

  // Getting different parts of the URL
  const protocol = url.protocol; // "http:"
  const hostname = url.hostname; // "localhost"
  const port = url.port; // "3000"
  const pathname = url.pathname; // "/view"
  const searchParams = url.searchParams; // URLSearchParams object

  // Getting specific query parameter
  const blogId = url.searchParams.get('blogId'); // "1"
};
