export * from './app'
export * from './doc'
export * from './user'

import { AppState} from './app'
import { EditState, BookEditState, BookReadState, ReadState } from './doc'

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


export interface JsonObject {
    [key: string]: any,
}
export type ApiStatus = {
    status: ApiEvent,
    error: string,
}

export type AppDispatchAction = React.Dispatch<React.SetStateAction<AppState>>
export type ApiDispatchAction = React.Dispatch<React.SetStateAction<ApiStatus>>;
export type BooleanDispatchAction = React.Dispatch<React.SetStateAction<boolean>>;
export type VoidReturnFunction = () => void;


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
