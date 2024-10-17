export * from './app'
export * from './doc'
export * from './user'
export * from './notification'
export * from './form'

import { AppState} from './app'
import { ReadBookState, EditBlogState, EditBookState, ReadBlogState, DocNode } from './doc'

export enum ApiEvent {
  INIT        = 1,
  START       = 2,
  SUCCESS     = 3,
  FAILED      = 4,
  IDLE        = 5,
}

export const UNAUTHORIZED = 300;
export const AUTHORIZED = 105;
export const APP_CSS = {
  linearGradient: 'linear-gradient(to right, #ffffff, #F6F8FC)',
};


export type ApiStatus = {
    status: ApiEvent,
    error: string,
}

export type AppDispatchAction = React.Dispatch<React.SetStateAction<AppState>>
export type ApiDispatchAction = React.Dispatch<React.SetStateAction<ApiStatus>>;
export type BooleanDispatchAction = React.Dispatch<React.SetStateAction<boolean>>;
export type VoidReturnFunction = () => void;


export type EditNodeComponentProps = {
    heading: string,
    state: EditBlogState | EditBookState,
    doc_idName: string,
    doc_id: number,
    FnCallback: (data: { data: DocNode }) => void,
    onCancel: VoidReturnFunction,
    url: string,
    isMobile: boolean,
}

export type ReadBlogAction = React.Dispatch<React.SetStateAction<ReadBlogState>>;
export type EditBlogAction = React.Dispatch<React.SetStateAction<EditBlogState>>;

export type EditBookAction = React.Dispatch<React.SetStateAction<EditBookState>>;
export type ReadBookAction = React.Dispatch<React.SetStateAction<ReadBookState>>;
