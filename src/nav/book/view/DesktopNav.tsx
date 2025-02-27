import { PageNavigation } from "./pageNavigation.tsx"
import {
  ReadBookAction,
  ReadBookState,
  DocNode,
  EditBookAction,
  EditBookState,
  VoidReturnFunction,
  BooleanDispatchAction,
} from "loony-types"

export default function DesktopNav(props: {
  isMobile: boolean
  setState: ReadBookAction | EditBookAction
  navNodes: DocNode[]
  state: ReadBookState | EditBookState
  doc_id: number
  viewFrontPage: VoidReturnFunction
  setMobileNavOpen: BooleanDispatchAction
}) {
  return (
    <div className="con-xxl-2 bor-right pad-top-15">
      <PageNavigation {...props} />
    </div>
  )
}
