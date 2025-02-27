import { Suspense, lazy } from "react"
import {
  BooleanDispatchAction,
  ReadBlogState,
  EditBlogState,
} from "loony-types"
import DesktopNav from "./DesktopNav"
const MobileNav = lazy(() => import("./MobileNav"))

export default function Nav(props: {
  isMobile: boolean
  state: ReadBlogState | EditBlogState
  setMobileNavOpen: BooleanDispatchAction
  mobileNavOpen: boolean
}) {
  if (props.isMobile) {
    return (
      <Suspense fallback={<></>}>
        <MobileNav {...props} />;
      </Suspense>
    )
  }

  return <DesktopNav {...props} />
}
