import { DocNode } from './doc'
import { VoidReturnFunction } from './common'

type CommonFormComponentProps = {
    heading: string
    // state: JsonObject
    doc_idName: string
    doc_id: number
    parent_id: number
    identity: number
    page_id: number
    parent_identity: number
    onCancel: VoidReturnFunction
    url: string
    isMobile: boolean
  }
  
  export type AddNodeComponentProps = {
    FnCallback: (data: { new_node: DocNode; update_node: DocNode }) => void
  } & CommonFormComponentProps
  
  export type EditNodeComponentProps = {
    FnCallback: (data: Node) => void
  } & CommonFormComponentProps
  
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

  export type EditImageComponentProps = {
    uploadImage: () => Promise<{ name: string }>
    changeFile: React.ChangeEventHandler<HTMLInputElement>
    imageEdit: string | null
    setCropImageMetadata: React.Dispatch<React.SetStateAction<CropImageMetadata>>
  }