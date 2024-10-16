export interface JsonObject {
    [key: string]: any,
}
export type ApiStatus = {
    status: number,
    error: string,
}

export type AppDispatchAction = React.Dispatch<React.SetStateAction<AppState>>
export type ApiDispatchAction = React.Dispatch<React.SetStateAction<ApiStatus>>;
export type BooleanDispatchAction = React.Dispatch<React.SetStateAction<boolean>>;
export type VoidReturnFunction = () => void;

export type Alert = null | { status: string; title: string; body: string }
export type AppState = {
  alert: Alert
  env: {
    base_url: string
  }
}

export interface AppContextProps extends AppState {
  setAppContext: React.Dispatch<React.SetStateAction<AppState>>
}

export interface AuthContextProps extends Auth {
    setAuthContext: React.Dispatch<React.SetStateAction<Auth>>
}

export type AppRouteProps = { 
    setMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>, 
    mobileNavOpen: boolean, 
    isMobile: boolean, 
    authContext: AuthContextProps,
    appContext: AppContextProps
}

// Auth
export interface User {
    fname: string,
    lname: string,
    email: string,
    uid: number,
}
export interface Auth {
    status: number,
    user: User | undefined | null
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
    doc_info: any | null,
    activeNode: any | null,
    page_id: number | null,
    section_id: number | null,
    activeSectionsByPageId: any[],
    allSectionsByPageId: any,
    activeSubSectionsBySectionId: any[],
    allSubSectionsBySectionId: any,
    nodes101: any[],
    frontPage: any | null,
    topNode: any | null
}

export type BookEditState = {
    addNode: any | null,
    deleteNode: any | null,
    editNode: any | null
} & BookReadState

export type ComponentProps = {
    heading: string,
    state: JsonObject,
    doc_idName: string,
    doc_id: number,
    FnCallback: (data: any) => void,
    onCancel: VoidReturnFunction,
    url: string,
    isMobile: boolean,
}
  
export type EditImageComponentProps = {
    uploadImage: () => Promise<any>,
    changeFile: React.ChangeEventHandler<HTMLInputElement>,
    imageEdit: string | null,
    setCropImageMetadata: React.Dispatch<React.SetStateAction<CropImageMetadata>>,
}
  
export type CropImageMetadata = {
    width: number | null, 
    height: number | null, 
    x: number | null, 
    y: number | null
}
  
export type AfterImageSelect = {
    image: null | File,
    width: null | number,
    height: null | number,
    hasImage: boolean,
}

export type EditAction = React.Dispatch<React.SetStateAction<EditState>>;
export type ReadAction = React.Dispatch<React.SetStateAction<ReadState>>;

export type BookEditAction = React.Dispatch<React.SetStateAction<BookEditState>>;
export type BookReadAction = React.Dispatch<React.SetStateAction<BookReadState>>;
