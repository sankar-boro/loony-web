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
import { LuFileWarning } from "react-icons/lu"
import { FiEdit2 } from "react-icons/fi"
import { Link } from "react-router-dom"

export default function MobileNav(props: {
  setState: ReadBookAction | EditBookAction
  navNodes: DocNode[]
  state: ReadBookState | EditBookState
  doc_id: number
  viewFrontPage: VoidReturnFunction
  setMobileNavOpen: BooleanDispatchAction
  mobileNavOpen: boolean
}) {
  const { setMobileNavOpen, doc_id } = props
  if (!props.mobileNavOpen) return null
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "rgb(0,0,0,0.5)",
        zIndex: 10,
        height: "105vh",
      }}
      onClick={() => {
        setMobileNavOpen(false)
      }}
    >
      <div
        style={{
          width: 320,
          backgroundColor: "white",
          maxWidth: "100%",
          height: "100%",
          position: "relative",
          padding: 12,
        }}
      >
        <PageNavigation {...props} />

        <div
          style={{ marginTop: 20, borderTop: "1px solid #ccc", paddingTop: 12 }}
        >
          <ul
            className="list-item"
            style={{ paddingLeft: 0, listStyle: "none" }}
          >
            <li style={{ display: "flex", alignItems: "center" }}>
              <FiEdit2 color="#2d2d2d" size={16} />
              <Link to={`/edit/book/${doc_id}`}>Edit this page</Link>
            </li>
            <li style={{ display: "flex", alignItems: "center" }}>
              <LuFileWarning color="#2d2d2d" size={16} />
              <Link to={`/edit/book/${doc_id}`}>Report</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
