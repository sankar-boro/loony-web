export * from './blog.js';

export const deleteBlogNode = (nodes, submitData, delete_node_index) => {
  const copyNodes = nodes.filter((node, node_index) => {
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

export const deleteBookNode = (allNodes, delete_node, submitData) => {
  const copyNodes = allNodes.filter((x) => x.uid !== delete_node.uid);
  copyNodes.forEach((x, i) => {
    if (x.uid === submitData.update_node_id) {
      copyNodes[i].parent_id = submitData.update_parent_id;
    }
  });
  return copyNodes;
};

export const appendBlogNode = (nodes, topData, resData) => {
  let newNodes = [];
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

export const updateBookNode = (nodes, updatedNode) => {
  let newNodes = nodes.map((n) => {
    if (updatedNode.uid === n.uid) {
      return { ...n, ...updatedNode };
    }
    return n;
  });

  return newNodes;
};

export const updateBlogNode = (nodes, updatedNode) => {
  let newNodes = nodes.map((n) => {
    if (updatedNode.uid === n.uid) {
      return { ...n, ...updatedNode };
    }
    return n;
  });

  return newNodes;
};

export const appendBookNode = (nodes, topData, resData) => {
  let newNodes = [];
  for (let index = 0; index < nodes.length; index++) {
    const element = nodes[index];
    if (topData.uid === element.uid) {
      newNodes.push(element);
      newNodes.push(resData.new_node);
    } else {
      newNodes.push(element);
    }
    if (nodes[index].uid === resData.update_node.update_row_id) {
      nodes[index].parent_id = resData.update_node.update_row_parent_id;
    }
  }
  return newNodes;
};

const groupSiblingsForParent = (parent, child) => {
  let pId = parent.uid;
  const siblings = [];
  let c = 0;

  const removeIds = [];
  const newSiblings = [];

  while (c !== child.length) {
    // eslint-disable-next-line no-loop-func
    child.forEach((ss) => {
      if (ss.parent_id === pId) {
        siblings.push(ss);
        pId = ss.uid;
        removeIds.push(ss.uid);
      }
    });
    c++;
  }

  child.forEach((ss) => {
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

function reOrderFrontPage(frontPage, samples) {
  let { allSubSectionGroups } = samples;
  const { allSectionGroups } = samples;
  const frontPages = groupSectionsForPage(frontPage, allSectionGroups);

  if (frontPages.newParent.child.length === 0) {
    return frontPages;
  }

  if (frontPages.newParent.child.length > 0) {
    const newSubSections = frontPages.newParent.child.map((section) => {
      const allSubSections = groupSubSectionsForSection(section, allSubSectionGroups);
      allSubSectionGroups = allSubSections.newSiblings;
      return allSubSections.newParent;
    });
    frontPages.newParent.child = newSubSections;
    return frontPages;
  }
  return frontPages;
}

function groupWithIdentity(apiData) {
  const identityGroups = {
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

const groupChapters = (parent_id, chapters) => {
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

export const orderTestNodes = (rawApi, removeIds = []) => {
  let data = rawApi;
  if (removeIds.length > 0) {
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
  // allFrontPages[101] = groupChapters(allGroups[100][0].uid, allFrontPages[101]);

  // const chapters = [];
  // Object.values(allFrontPages).forEach((frontPageObjectValue) => {
  //   frontPageObjectValue.forEach((frontPage) => {
  //     const { newParent, newSiblings } = reOrderFrontPage(frontPage, samples);
  //     samples.allSectionGroups = newSiblings;
  //     chapters.push(newParent);
  //   });
  // });
  // return chapters;
  return [];
};

export const orderBookNodes = (rawApi, removeIds = []) => {
  let data = rawApi;
  if (removeIds.length > 0) {
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

  const chapters = [];
  Object.values(allFrontPages).forEach((frontPageObjectValue) => {
    frontPageObjectValue.forEach((frontPage) => {
      const { newParent, newSiblings } = reOrderFrontPage(frontPage, samples);
      samples.allSectionGroups = newSiblings;
      chapters.push(newParent);
    });
  });
  return chapters;
};

export const extractImage = (images) => {
  if (typeof images === 'object') {
    return images[0];
  }
  let parsedImage = null;
  const image = images && JSON.parse(images);
  if (image && Array.isArray(image) && image.length > 0) {
    parsedImage = image[0];
  }

  return parsedImage;
};
