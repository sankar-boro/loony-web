export type Node = {
    uid: number,
    title: string,
    body: string,
    images: string,
    user_id: number,
    identity: number,
    theme: number,
    parent_id?: number,
    child?: Node[],
    created_at: string,
    updated_at?: string,
}

export type ReadState = {
    doc_info: any | null;
    pageId: number | null;
    mainNode: any | null;
    activeNode: any | null;
    nodeIndex: number | null;
    rawNodes: any[];
    blogNodes: any[];
    childNodes: any[];
}

export type EditState = {
    modal: string;
    addNode: any | null;
    editNode: any | null;
    deleteNode: any | null,
} & ReadState

export type BookReadState = {
    modal: string | null,
    doc_info: Node | null,
    activeNode: Node | null,
    page_id: number | null,
    section_id: number | null,
    activeSectionsByPageId: Node[],
    activeSubSectionsBySectionId: Node[],
    allSectionsByPageId: any,
    allSubSectionsBySectionId: any,
    nodes101: Node[],
    frontPage: Node | null,
    topNode: Node | null
}

export type BookEditState = {
    addNode: Node | null,
    deleteNode: Node | null,
    editNode: Node | null
} & BookReadState