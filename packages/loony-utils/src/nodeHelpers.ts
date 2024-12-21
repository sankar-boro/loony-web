import { axiosInstance } from 'loony-query'
import {
  PageStatusDispatchAction,
  AppendNodeResponse,
  EditBookAction,
  EditBlogAction,
  GroupedNodesById,
  ReadBlogAction,
  ReadBookAction,
  Status,
} from 'loony-types'
import { DocNode } from 'loony-types'

const resetState = {
  editNode: null,
  addNode: null,
  modal: '',
}

export const getBlogNodes = (
  blog_id: number,
  setState: ReadBlogAction | EditBlogAction,
  setStatus: PageStatusDispatchAction
) => {
  const url = `/blog/get/nodes?blog_id=${blog_id}`
  setStatus((prevState) => ({
    ...prevState,
    status: Status.FETCHING,
  }))
  axiosInstance.get(url).then(({ data }) => {
    const unOrderedChildNodes = data.child_nodes
    const blogNodes = orderBlogNodes(unOrderedChildNodes, data.main_node)
    const mainNode = blogNodes && blogNodes[0]
    const childNodes = blogNodes.length >= 2 ? blogNodes.slice(1) : []

    setState((prevState) => ({
      ...prevState,
      mainNode,
      childNodes,
      blogNodes,
    }))
    setStatus((prevState) => ({
      ...prevState,
      status: Status.VIEW_PAGE,
    }))
  })
}

export const getChapters = (
  book_id: number,
  setState: ReadBookAction | EditBookAction,
  setStatus: PageStatusDispatchAction
) => {
  const url = `/book/get/nodes?book_id=${book_id}`
  setStatus((prevState) => ({
    ...prevState,
    status: Status.FETCHING,
  }))
  axiosInstance.get(url).then(({ data }) => {
    const bookTree = orderBookNodes(data.child_nodes, data.main_node, [])
    const mainNode = bookTree && bookTree[0]
    const __nodes101 = bookTree.slice(1)

    setState((prevState) => ({
      ...prevState,
      mainNode,
      frontPage: mainNode,
      parentNode: mainNode,
      nodes101: __nodes101,
      page_id: mainNode.uid,
    }))
    setStatus((prevStatus) => ({
      ...prevStatus,
      status: Status.VIEW_PAGE,
    }))
  })
}

export const getSections = (
  __node: DocNode,
  setState: ReadBookAction | EditBookAction,
  setStatus: PageStatusDispatchAction,
  allSectionsByPageId: GroupedNodesById,
  book_id: number
) => {
  const { uid } = __node
  const url = `/book/get/sections?book_id=${book_id}&page_id=${uid}`
  if (allSectionsByPageId[uid]) {
    setState((prevState) => ({
      ...prevState,
      ...resetState,
      activeSectionsByPageId: allSectionsByPageId[uid],
      page_id: __node.uid,
      parentNode: __node,
      activeSubSectionsBySectionId: [],
    }))
  } else {
    setStatus((prevState) => ({
      ...prevState,
      status: Status.FETCHING,
    }))
    axiosInstance.get(url).then(({ data }) => {
      const res = orderNodes(data, __node)
      setState((prevState) => ({
        ...prevState,
        ...resetState,
        activeSectionsByPageId: res,
        allSectionsByPageId: {
          ...allSectionsByPageId,
          [uid]: res,
        },
        page_id: __node.uid,
        parentNode: __node,
        activeSubSectionsBySectionId: [],
      }))
      setStatus((prevState) => ({
        ...prevState,
        status: Status.VIEW_PAGE,
      }))
    })
  }
}

export const getSubSections = (
  __node: DocNode,
  setState: ReadBookAction | EditBookAction,
  setStatus: PageStatusDispatchAction,
  allSubSectionsBySectionId: GroupedNodesById,
  book_id: number
) => {
  const { uid } = __node
  const url = `/book/get/sub_sections?book_id=${book_id}&page_id=${uid}`
  if (allSubSectionsBySectionId[uid]) {
    setState((prevState) => ({
      ...prevState,
      ...resetState,
      activeSubSectionsBySectionId: allSubSectionsBySectionId[uid],
      section_id: __node.uid,
      parentNode: __node,
    }))
  } else {
    setStatus((prevState) => ({
      ...prevState,
      status: Status.FETCHING,
    }))
    axiosInstance.get(url).then(({ data }) => {
      const res = orderNodes(data, __node)
      setState((prevState) => ({
        ...prevState,
        ...resetState,
        activeSubSectionsBySectionId: res,
        allSubSectionsBySectionId: {
          ...allSubSectionsBySectionId,
          [uid]: res,
        },
        section_id: __node.uid,
        parentNode: __node,
      }))
      setStatus((prevState) => ({
        ...prevState,
        status: Status.VIEW_PAGE,
      }))
    })
  }
}

/**
 *
 * @param childNodes
 * @param submitData
 * @param delete_node_index
 * @returns
 */
export const deleteBlogNode = (
  childNodes: DocNode[],
  submitData: {
    delete_node: {
      identity: number
      uid: number
    }
    update_node: {
      parent_id: number | undefined
      uid: null | number
    } | null
  }
) => {
  let returnNodes = []

  returnNodes = childNodes.filter((node) => {
    if (submitData.delete_node.uid === node.uid) {
      return false
    }
    return true
  })

  if (submitData.update_node) {
    returnNodes = returnNodes.map((node) => {
      if (node.uid === submitData.update_node.uid) {
        node.parent_id = submitData.update_node.parent_id
      }
      return node
    })
  }

  return returnNodes
}

export const deleteOne = (
  nodes: DocNode[],
  {
    delete_nodes,
    update_node,
  }: {
    delete_nodes: number[]
    update_node: { parent_id: number; uid: number }
  }
) => {
  const newNodes = nodes.filter((x) => !delete_nodes.includes(x.uid))
  if (update_node) {
    newNodes.forEach((x, i) => {
      if (x.uid === update_node.uid) {
        newNodes[i].parent_id = update_node.parent_id
      }
    })
  }
  return newNodes
}

/**
 *
 * @param childNodes DocNode[]
 * @param topData DocNode
 * @param resData AppendNodeResponse
 * @returns DocNode[]
 */
export const appendBlogNode = (
  childNodes: DocNode[],
  topNode: DocNode,
  resData: AppendNodeResponse,
  mainNode: DocNode
) => {
  const newNode = resData.new_node
  const newNodes = []

  // if there are no child nodes
  if (childNodes.length === 0) {
    return [resData.new_node]
  }

  // if the new node is a child of the main node
  if (resData.new_node.parent_id === mainNode.uid) {
    const newChildNodes = childNodes
    newChildNodes[0].parent_id = resData.new_node.uid
    return [resData.new_node, ...newChildNodes]
  }

  // if there are child nodes
  for (let index = 0; index < childNodes.length; index++) {
    if (newNode.parent_id === childNodes[index].uid) {
      newNodes.push(childNodes[index])
      newNodes.push(newNode)

      if (childNodes[index + 1]) {
        childNodes[index + 1].parent_id = newNode.uid
      }
    } else {
      newNodes.push(childNodes[index])
    }
  }

  return newNodes
}

export const updateBookNode = (nodes: DocNode[], updatedNode: DocNode) => {
  const newNodes = nodes.map((n) => {
    if (updatedNode.uid === n.uid) {
      return { ...n, ...updatedNode }
    }
    return n
  })

  return newNodes
}

export const updateBlogNode = (nodes: DocNode[], updatedNode: DocNode) => {
  const newNodes = nodes.map((n) => {
    if (updatedNode.uid === n.uid) {
      return { ...n, ...updatedNode }
    }
    return n
  })

  return newNodes
}

export const addNewNode = (
  nodes: DocNode[],
  topData: DocNode,
  res: { new_node: DocNode; update_node: DocNode }
) => {
  const { new_node, update_node } = res
  const newNodes = []

  if (update_node) {
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index]
      if (topData.uid === element.parent_id) {
        newNodes.push(new_node)
        newNodes.push(element)
      } else {
        newNodes.push(element)
      }
    }
    for (let index = 0; index < nodes.length; index++) {
      if (nodes[index].uid === update_node.uid) {
        nodes[index].parent_id = update_node.parent_id
      }
    }
  } else {
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index]
      if (topData.uid === element.uid) {
        newNodes.push(element)
        newNodes.push(new_node)
      } else {
        newNodes.push(element)
      }
    }
  }

  if (newNodes.length === 0) {
    return [new_node]
  }
  return newNodes
}

export const appendBookNode = addNewNode
export const appendChapters = addNewNode
export const appendSections = addNewNode
export const appendSubSections = addNewNode

const groupSiblingsForParent = (parent: DocNode, child: DocNode[]) => {
  let pId = parent.uid
  const siblings: DocNode[] = []
  let c = 0

  const removeIds: number[] = []
  const newSiblings: DocNode[] = []

  while (c !== child.length) {
    // eslint-disable-next-line no-loop-func
    child.forEach((ss: DocNode) => {
      if (ss.parent_id === pId) {
        siblings.push(ss)
        pId = ss.uid
        removeIds.push(ss.uid)
      }
    })
    c++
  }

  child.forEach((ss: DocNode) => {
    if (!removeIds.includes(ss.uid)) {
      newSiblings.push(ss)
    }
  })
  const newParent = parent
  newParent.child = siblings
  return { newParent, newSiblings, removeIds }
}

const groupSectionsForPage = groupSiblingsForParent
const groupSubSectionsForSection = groupSiblingsForParent

function reOrderFrontPage(
  frontPage: DocNode,
  samples: { allSubSectionGroups: DocNode[]; allSectionGroups: DocNode[] }
) {
  let { allSubSectionGroups } = samples
  const { allSectionGroups } = samples
  const frontPages = groupSectionsForPage(frontPage, allSectionGroups)

  if (frontPages.newParent.child.length === 0) {
    return frontPages
  }

  if (frontPages.newParent.child.length > 0) {
    const newSubSections = frontPages.newParent.child.map(
      (section: DocNode) => {
        const allSubSections = groupSubSectionsForSection(
          section,
          allSubSectionGroups
        )
        allSubSectionGroups = allSubSections.newSiblings
        return allSubSections.newParent
      }
    )
    frontPages.newParent.child = newSubSections
    return frontPages
  }
  return frontPages
}

function groupWithIdentity(apiData: DocNode[]) {
  const identityGroups = {
    100: [], // Front page
    101: [], // Chapter
    102: [], // Section
    103: [], // Section Nodes
  }

  apiData.forEach((node) => {
    if (identityGroups[node.identity]) {
      identityGroups[node.identity].push(node)
    }
  })
  return identityGroups
}

const groupChapters = (parent_id: number, chapters: DocNode[]) => {
  let currentparent_id = parent_id
  const orders = []
  while (orders.length !== chapters.length) {
    // eslint-disable-next-line no-loop-func
    for (let i = 0; i < chapters.length; i++) {
      const thisChapter = chapters[i]
      if (currentparent_id === thisChapter.parent_id) {
        orders.push(thisChapter)
        currentparent_id = thisChapter.uid
        break
      }
    }
  }
  return orders
}

const filterNodes = (nodes: DocNode[], removeIds = []) => {
  if (removeIds && removeIds.length > 0) {
    return nodes.filter((d) => {
      if (removeIds.includes(d.uid)) {
        return false
      }
      return true
    })
  }
  return nodes
}

/**
 *
 * @param nodes DocNode[]
 * @param mainNode DocNode
 * @param removeIds number[]
 * @returns DocNode[]
 */
export const orderBookNodes = (
  nodes: DocNode[],
  mainNode?: DocNode,
  removeIds: number[] = []
) => {
  let allNodes = mainNode ? [mainNode, ...nodes] : nodes
  allNodes = filterNodes(allNodes, removeIds)
  const allGroups = groupWithIdentity(allNodes)
  const samples = {
    allSectionGroups: allGroups[102],
    allSubSectionGroups: allGroups[103],
  }

  const allFrontPages = {
    100: allGroups[100],
    101: allGroups[101],
  }
  allFrontPages[101] = groupChapters(allGroups[100][0].uid, allFrontPages[101])

  const chapters: DocNode[] = []
  Object.values(allFrontPages).forEach((frontPageObjectValue) => {
    frontPageObjectValue.forEach((frontPage: DocNode) => {
      const { newParent, newSiblings } = reOrderFrontPage(frontPage, samples)
      samples.allSectionGroups = newSiblings
      chapters.push(newParent)
    })
  })
  return chapters
}

/**
 *
 * @param nodes DocNode[]
 * @param parentNode DocNode
 * @returns DocNode[]
 */
export const orderNodes = (nodes: DocNode[], parentNode: DocNode) => {
  let updateParentNode = parentNode
  const results = []

  while (results.length !== nodes.length) {
    // eslint-disable-next-line no-loop-func
    for (let i = 0; i < nodes.length; i++) {
      const thisNode = nodes[i]
      if (updateParentNode.uid === thisNode.parent_id) {
        results.push(thisNode)
        updateParentNode = thisNode
        break
      }
    }
  }

  return results
}

/**
 *
 * @param nodes DocNode[]
 * @param mainNode DocNode
 * @param removeIds number[]
 * @returns DocNode[]
 */
export const orderBlogNodes = (
  nodes: DocNode[],
  mainNode: DocNode,
  removeIds?: number[]
) => {
  return [mainNode, ...orderBlogChildNodes(nodes, mainNode, removeIds)]
}

/**
 *
 * @param nodes DocNode[]
 * @param mainNode DocNode
 * @param removeIds number[]
 * @returns DocNode[]
 */
export const orderBlogChildNodes = (
  nodes: DocNode[],
  mainNode: DocNode,
  removeIds?: number[]
) => {
  let childNodes = nodes
  childNodes = filterNodes(childNodes, removeIds)

  const results = []
  let parentNode = mainNode

  while (childNodes.length !== results.length) {
    for (let i = 0; i < childNodes.length; i++) {
      if (childNodes[i].parent_id === parentNode.uid) {
        parentNode = childNodes[i]
        results.push(childNodes[i])
        break
      }
    }
  }

  return results
}
