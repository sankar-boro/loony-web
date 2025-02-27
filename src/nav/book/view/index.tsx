import { Suspense, lazy } from "react"
import {
  ReadBookAction,
  ReadBookState,
  DocNode,
  EditBookAction,
  EditBookState,
  VoidReturnFunction,
  BooleanDispatchAction,
} from "loony-types"
import DesktopNav from "./DesktopNav"
const MobileNav = lazy(() => import("./MobileNav"))

export default function Nav(props: {
  isMobile: boolean
  setState: ReadBookAction | EditBookAction
  navNodes: DocNode[]
  state: ReadBookState | EditBookState
  doc_id: number
  viewFrontPage: VoidReturnFunction
  setMobileNavOpen: BooleanDispatchAction
  mobileNavOpen: boolean
}) {
  if (props.isMobile) {
    return (
      <Suspense fallback={<></>}>
        <MobileNav {...props} />
      </Suspense>
    )
  }

  return <DesktopNav {...props} />
}
