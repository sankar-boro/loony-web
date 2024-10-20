interface Indexer {
    [key: string]: any;  // Allows indexing with any string key
}

type DocImages = {
    name: string
}

export type DocNode = {
    uid: number,
    title: string,
    body: string,
    images: string | DocImages[],
    user_id: number,
    identity: number,
    theme: number,
    parent_id?: number,
    child?: DocNode[],
    created_at: string,
    updated_at?: string,
} & Indexer

export type AppendNodeResponse = {
    new_node: DocNode,
    update_node: DocNode
}

export type GroupedNodesById = {
    [key: number]: DocNode[],
}

// Doc State

export enum DocStatus {
    EditNode,
    DeleteNode,
    CreateNode,
    None
}

type CommonDocState = {
    status: number,
    topNode: DocNode | null,
    doc_id: number
}

type ReadDocState = {
    doc_info: DocNode | null;
    mainNode: DocNode | null;
    rawNodes: DocNode[];
} & CommonDocState

type EditDocState = {
    modal: string;
    addNode: DocNode | null;
    editNode: DocNode | null;
    activeNode: DocNode | null;
    deleteNode: DocNode | null,
} & ReadDocState

// Blog State

export type ReadBlogState = CommonDocState & ReadDocState & { childNodes: DocNode[] };
export type EditBlogState = ReadBlogState & EditDocState & { nodeIndex: number | null };

// Book State

type CommonBookState = {
    page_id: number | null,
    section_id: number | null,
    activeSectionsByPageId: DocNode[],
    activeSubSectionsBySectionId: DocNode[],
    allSectionsByPageId: GroupedNodesById,
    allSubSectionsBySectionId: GroupedNodesById,
}

export type ReadBookState = CommonBookState & {
    doc_info: DocNode | null,
    activeNode: DocNode | null,
    nodes101: DocNode[],
    frontPage: DocNode | null
}

export type EditBookState = ReadBookState & EditDocState


