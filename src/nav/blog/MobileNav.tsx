import { BooleanDispatchAction, ReadBlogState } from "loony-types"
import { Chapters } from "./BlogPageNavigation.tsx"
import { LuFileWarning } from "react-icons/lu"
import { FiEdit2 } from "react-icons/fi"
import { Link } from "react-router-dom"
export default function ViewNav(props: {
  setMobileNavOpen: BooleanDispatchAction
  state: ReadBlogState
  mobileNavOpen: boolean
}) {
  const { setMobileNavOpen, state } = props
  const { doc_id } = state
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
        <Chapters state={state} />
        <div
          style={{ marginTop: 20, borderTop: "1px solid #ccc", paddingTop: 12 }}
        >
          <ul
            className="list-item"
            style={{ paddingLeft: 0, listStyle: "none" }}
          >
            <li style={{ display: "flex", alignItems: "center" }}>
              <FiEdit2 color="#2d2d2d" size={16} />
              <Link to={`/edit/blog/${doc_id}`}>Edit this page</Link>
            </li>
            <li style={{ display: "flex", alignItems: "center" }}>
              <LuFileWarning color="#2d2d2d" size={16} />
              <Link to={`/edit/blog/${doc_id}`}>Report</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
