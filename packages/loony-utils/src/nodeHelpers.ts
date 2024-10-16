interface NodeObject {
  [key: string]: any;
}

export const deleteBlogNode = (nodes: NodeObject[], submitData: NodeObject, delete_node_index: number) => {
  const copyNodes = nodes.filter((node) => {
    if (submitData.delete_node_id === node.uid) {
      return false;
    }
    return true;
  });
  if (copyNodes[delete_node_index + 1]) {
    copyNodes[delete_node_index + 1].parent_id = submitData.update_parent_id;
  }
  return copyNodes;
};

export const deleteOne = (nodes: NodeObject[], { deleted_ids, parent_id, updated_id }: { deleted_ids: number[], parent_id: number, updated_id: number, num_deleted_rows: number }) => {
  const newNodes = nodes.filter((x) => !deleted_ids.includes(x.uid));
  if (updated_id) {
    newNodes.forEach((x, i) => {
      if (x.uid === updated_id) {
        newNodes[i].parent_id = parent_id;
      }
    });
  }
  return newNodes;
};

export const appendBlogNode = (nodes: NodeObject[], topData: NodeObject, resData: NodeObject) => {
  const newNodes = [];
  for (let index = 0; index < nodes.length; index++) {
    const element = nodes[index];
    if (topData.uid === element.uid) {
      newNodes.push(element);
      newNodes.push(resData.new_node);
      if (nodes[index + 1]) {
        nodes[index + 1].parent_id = resData.update_node.update_row_parent_id;
      }
    } else {
      newNodes.push(element);
    }
  }
  return newNodes;
};

export const updateBookNode = (nodes: NodeObject[], updatedNode: NodeObject) => {
  const newNodes = nodes.map((n) => {
    if (updatedNode.uid === n.uid) {
      return { ...n, ...updatedNode };
    }
    return n;
  });

  return newNodes;
};

export const updateBlogNode = (nodes: NodeObject[], updatedNode: NodeObject) => {
  const newNodes = nodes.map((n) => {
    if (updatedNode.uid === n.uid) {
      return { ...n, ...updatedNode };
    }
    return n;
  });

  return newNodes;
};

export const addNewNode = (nodes: NodeObject[], topData: NodeObject, res: NodeObject) => {
  const { new_node, update_node } = res;
  const newNodes = [];

  if (update_node) {
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index];
      if (topData.uid === element.parent_id) {
        newNodes.push(new_node);
        newNodes.push(element);
      } else {
        newNodes.push(element);
      }
    }
    for (let index = 0; index < nodes.length; index++) {
      if (nodes[index].uid === update_node.uid) {
        nodes[index].parent_id = update_node.parent_id;
      }
    }
  } else {
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index];
      if (topData.uid === element.uid) {
        newNodes.push(element);
        newNodes.push(new_node);
      } else {
        newNodes.push(element);
      }
    }
  }

  if (newNodes.length === 0) {
    return [new_node];
  }
  return newNodes;
};

export const appendBookNode = addNewNode;
export const appendChapters = addNewNode;
export const appendSections = addNewNode;
export const appendSubSections = addNewNode;

const groupSiblingsForParent = (parent: NodeObject, child: NodeObject) => {
  let pId = parent.uid;
  const siblings: NodeObject[] = [];
  let c = 0;

  const removeIds: NodeObject[] = [];
  const newSiblings: NodeObject[] = [];

  while (c !== child.length) {
    // eslint-disable-next-line no-loop-func
    child.forEach((ss: NodeObject) => {
      if (ss.parent_id === pId) {
        siblings.push(ss);
        pId = ss.uid;
        removeIds.push(ss.uid);
      }
    });
    c++;
  }

  child.forEach((ss: NodeObject) => {
    if (!removeIds.includes(ss.uid)) {
      newSiblings.push(ss);
    }
  });
  const newParent = parent;
  newParent.child = siblings;
  return { newParent, newSiblings, removeIds };
};

const groupSectionsForPage = groupSiblingsForParent;
const groupSubSectionsForSection = groupSiblingsForParent;

function reOrderFrontPage(frontPage: NodeObject, samples: NodeObject) {
  let { allSubSectionGroups } = samples;
  const { allSectionGroups } = samples;
  const frontPages = groupSectionsForPage(frontPage, allSectionGroups);

  if (frontPages.newParent.child.length === 0) {
    return frontPages;
  }

  if (frontPages.newParent.child.length > 0) {
    const newSubSections = frontPages.newParent.child.map((section: NodeObject) => {
      const allSubSections = groupSubSectionsForSection(section, allSubSectionGroups);
      allSubSectionGroups = allSubSections.newSiblings;
      return allSubSections.newParent;
    });
    frontPages.newParent.child = newSubSections;
    return frontPages;
  }
  return frontPages;
}

function groupWithIdentity(apiData: NodeObject[]) {
  const identityGroups: NodeObject = {
    100: [], // Front page
    101: [], // Chapter
    102: [], // Section
    103: [], // Section Nodes
  };

  apiData.forEach((node) => {
    if (identityGroups[node.identity]) {
      identityGroups[node.identity].push(node);
    }
  });
  return identityGroups;
}

const groupChapters = (parent_id: number, chapters: NodeObject[]) => {
  let currentparent_id = parent_id;
  const orders = [];
  while (orders.length !== chapters.length) {
    // eslint-disable-next-line no-loop-func
    for (let i = 0; i < chapters.length; i++) {
      const thisChapter = chapters[i];
      if (currentparent_id === thisChapter.parent_id) {
        orders.push(thisChapter);
        currentparent_id = thisChapter.uid;
        break;
      }
    }
  }
  return orders;
};

export const orderBookNodes = (rawApi: NodeObject[], removeIds: number[] = []) => {
  let data = rawApi;
  if (removeIds && removeIds.length > 0) {
    data = rawApi.filter((d) => {
      if (removeIds.includes(d.uid)) {
        return false;
      }
      return true;
    });
  }

  const allGroups = groupWithIdentity(data);
  const samples = {
    allSectionGroups: allGroups[102],
    allSubSectionGroups: allGroups[103],
  };

  const allFrontPages = {
    100: allGroups[100],
    101: allGroups[101],
  };
  allFrontPages[101] = groupChapters(allGroups[100][0].uid, allFrontPages[101]);

  const chapters: NodeObject[] = [];
  Object.values(allFrontPages).forEach((frontPageObjectValue) => {
    frontPageObjectValue.forEach((frontPage: NodeObject) => {
      const { newParent, newSiblings } = reOrderFrontPage(frontPage, samples);
      samples.allSectionGroups = newSiblings;
      chapters.push(newParent);
    });
  });
  return chapters;
};

export const orderNodes = (nodes: NodeObject[], parentNode: NodeObject) => {
  let currentNode = parentNode;
  const results = [];

  while (results.length !== nodes.length) {
    // eslint-disable-next-line no-loop-func
    for (let i = 0; i < nodes.length; i++) {
      const thisNode = nodes[i];
      if (currentNode.uid === thisNode.parent_id) {
        results.push(thisNode);
        currentNode = thisNode;
        break;
      }
    }
  }

  return results;
};

type ImageRes = {
  name: string
}

export const extractImage = (images: ImageRes[] | string | null): ImageRes | null => {
  if (!images) return null;
  if (typeof images === "object") {
    return images[0];
  }
  let parsedImage = null;
  const image = images && JSON.parse(images);
  if (image && Array.isArray(image) && image.length > 0) {
    parsedImage = image[0];
  }

  return parsedImage;
};

export const orderBlogNodes = (data: NodeObject[]) => {
  const totalNodes = data.length;
  const parentNodesMap = new Map();

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
